import 'dart:async';
import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/constants.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';
import '../models/gift.dart';
import '../models/message.dart';
import '../models/room.dart';
import '../services/auth_service.dart';
import '../services/socket_service.dart';
import '../services/voice_service.dart';
import '../services/wallet_service.dart';
import '../widgets/gift_panel.dart';
import '../widgets/mic_seat.dart';
import '../widgets/room_chat.dart';
import '../widgets/svga_player_widget.dart';

/// The core voice room: 8 mic seats, listeners, hand-raise, mute, kick/ban,
/// gifts (SVGA), and in-room text chat.
class RoomScreen extends StatefulWidget {
  final Room room;
  const RoomScreen({super.key, required this.room});

  @override
  State<RoomScreen> createState() => _RoomScreenState();
}

class _RoomScreenState extends State<RoomScreen> {
  late Room _room;
  final _chatController = TextEditingController();
  final List<ChatMessage> _messages = [];
  List<Gift> _gifts = [];
  StreamSubscription<SocketEvent>? _sub;
  bool _handRaised = false;
  bool _onMic = false;
  bool _muted = false;
  int _mySeat = -1;

  String get _myId => AuthService.instance.currentUser?.id ?? '';

  @override
  void initState() {
    super.initState();
    _room = widget.room;
    _enter();
  }

  Future<void> _enter() async {
    // 1. Realtime
    await SocketService.instance.connect();
    SocketService.instance.joinRoom(_room.id);
    _sub = SocketService.instance.events.listen(_onSocketEvent);

    // 2. Voice (join as audience first)
    try {
      await VoiceService.instance.join(
        roomId: _room.id,
        channel: _room.agoraChannel.isNotEmpty
            ? _room.agoraChannel
            : 'room_${_room.id}',
        uid: _myId.hashCode & 0x7fffffff,
      );
      await VoiceService.instance.setRole(onMic: false);
    } catch (_) {}

    // 3. Gift catalog
    try {
      _gifts = await WalletService.instance.getGiftCatalog();
    } catch (_) {}

    if (mounted) setState(() {});
  }

  void _onSocketEvent(SocketEvent e) {
    switch (e.type) {
      case SocketEvents.roomState:
        setState(() => _room = Room.fromJson(Map<String, dynamic>.from(e.data)));
        break;
      case SocketEvents.seatAccept:
        final d = Map<String, dynamic>.from(e.data);
        if (d['userId'] == _myId) {
          setState(() {
            _onMic = true;
            _mySeat = d['seatIndex'] ?? -1;
            _handRaised = false;
          });
          VoiceService.instance.setRole(onMic: true);
        }
        break;
      case SocketEvents.seatReject:
        setState(() => _handRaised = false);
        break;
      case SocketEvents.chatMessage:
        setState(() =>
            _messages.add(ChatMessage.fromJson(Map<String, dynamic>.from(e.data))));
        break;
      case SocketEvents.giftReceived:
        final ev = GiftEvent.fromJson(Map<String, dynamic>.from(e.data));
        if (ev.gift.svgaFile.isNotEmpty) {
          SvgaOverlay.show(context, ev.gift.svgaFile);
        }
        setState(() => _messages.add(ChatMessage(
              id: DateTime.now().toString(),
              userId: ev.senderId,
              username: 'هدية',
              text:
                  '${ev.senderName} أرسل ${ev.gift.name} إلى ${ev.receiverName}',
              type: MessageType.gift,
              createdAt: DateTime.now(),
            )));
        break;
    }
  }

  void _toggleHand() {
    setState(() => _handRaised = !_handRaised);
    if (_handRaised) {
      SocketService.instance.requestSeat(_room.id, _firstFreeSeat());
    } else {
      SocketService.instance.leaveSeat(_room.id);
    }
  }

  int _firstFreeSeat() {
    for (final s in _room.seats) {
      if (s.isEmpty) return s.index;
    }
    return 0;
  }

  Future<void> _toggleMute() async {
    setState(() => _muted = !_muted);
    await VoiceService.instance.setMuted(_muted);
    SocketService.instance.toggleMute(_room.id, _muted);
  }

  void _openGifts() {
    final coins = AuthService.instance.currentUser?.coins ?? 0;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => GiftPanel(
        gifts: _gifts,
        userCoins: coins,
        onSend: (gift, qty) {
          final target = _room.seats
              .firstWhere((s) => !s.isEmpty,
                  orElse: () => const Seat(index: 0))
              .userId ??
              '';
          SocketService.instance
              .sendGift(_room.id, gift.id, target, quantity: qty);
        },
      ),
    );
  }

  void _sendChat() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;
    SocketService.instance.sendChat(_room.id, text);
    _chatController.clear();
  }

  Future<void> _leave() async {
    SocketService.instance.leaveRoom(_room.id);
    await VoiceService.instance.leave();
    if (mounted) Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _sub?.cancel();
    _chatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage(A.bgRoom1),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _header(),
              const SizedBox(height: 8),
              _seatsGrid(),
              const SizedBox(height: 12),
              _listenerBar(),
              const SizedBox(height: 8),
              Expanded(child: _chatArea()),
              _actionBar(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _header() => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor: AppTheme.surface,
              backgroundImage: _room.coverImage.isNotEmpty
                  ? NetworkImage(_room.coverImage)
                  : null,
              child: _room.coverImage.isEmpty
                  ? const AssetIcon(A.mic, size: 20)
                  : null,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_room.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                  Text('${_room.listenerCount} مستمع',
                      style: const TextStyle(
                          fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
            ),
            AssetIconButton(
              asset: A.close,
              size: 40,
              iconSize: 22,
              onPressed: _leave,
            ),
          ],
        ),
      );

  Widget _seatsGrid() {
    final seats = _room.seats.isEmpty
        ? List.generate(AppConstants.maxMicSeats, (i) => Seat(index: i))
        : _room.seats;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: GridView.count(
        crossAxisCount: 4,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 14,
        crossAxisSpacing: 8,
        childAspectRatio: .78,
        children: seats
            .map((s) => MicSeat(
                  seat: s,
                  isHost: s.userId == _room.ownerId,
                  onTap: () {
                    if (s.isEmpty) {
                      SocketService.instance.requestSeat(_room.id, s.index);
                    }
                  },
                  onLongPress: () => _showSeatActions(s),
                ))
            .toList(),
      ),
    );
  }

  void _showSeatActions(Seat s) {
    if (s.isEmpty) return;
    final isOwner = _room.ownerId == _myId;
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const AssetIcon(A.gift, size: 24),
              title: const Text('إرسال هدية'),
              onTap: () {
                Navigator.pop(context);
                _openGifts();
              },
            ),
            if (isOwner) ...[
              ListTile(
                leading: const AssetIcon(A.micOff, size: 24),
                title: const Text('كتم الصوت'),
                onTap: () {
                  SocketService.instance.toggleMute(_room.id, true);
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const AssetIcon(A.kick, size: 24),
                title: const Text('طرد من المقعد'),
                onTap: () {
                  SocketService.instance.kickUser(_room.id, s.userId!);
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const AssetIcon(A.block, size: 24),
                title: const Text('حظر'),
                onTap: () {
                  SocketService.instance.banUser(_room.id, s.userId!);
                  Navigator.pop(context);
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _listenerBar() => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            const AssetIcon(A.headset, size: 18),
            const SizedBox(width: 6),
            Text('${_room.listenerCount}',
                style: const TextStyle(color: AppTheme.textMuted)),
            const Spacer(),
            if (_handRaised)
              const Text('✋ يدك مرفوعة...',
                  style: TextStyle(color: AppTheme.gold, fontSize: 12)),
          ],
        ),
      );

  Widget _chatArea() => Container(
        margin: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(.25),
          borderRadius: BorderRadius.circular(16),
        ),
        child: RoomChat(
          messages: _messages,
          controller: _chatController,
          onSend: _sendChat,
        ),
      );

  Widget _actionBar() => Padding(
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
        child: Row(
          children: [
            AssetIconButton(
              asset: _handRaised ? A.handBadge : A.handRaise,
              glow: _handRaised ? AppTheme.gold : null,
              onPressed: _toggleHand,
            ),
            const SizedBox(width: 10),
            if (_onMic)
              AssetIconButton(
                asset: _muted ? A.micOff : A.micOn,
                glow: _muted ? Colors.redAccent : null,
                onPressed: _toggleMute,
              ),
            const Spacer(),
            AssetIconButton(
              asset: A.giftBtn,
              glow: AppTheme.pink,
              onPressed: _openGifts,
            ),
          ],
        ),
      );

  Widget _circleBtn({
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) =>
      GestureDetector(
        onTap: onTap,
        child: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          child: Icon(icon, color: Colors.white),
        ),
      );
}
