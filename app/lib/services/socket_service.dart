import 'dart:async';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/constants.dart';

/// Realtime gateway — wraps Socket.io with typed helpers and a broadcast stream
/// of room events the UI can listen to.
class SocketService {
  SocketService._();
  static final SocketService instance = SocketService._();

  io.Socket? _socket;
  final _storage = const FlutterSecureStorage();
  final _events = StreamController<SocketEvent>.broadcast();

  Stream<SocketEvent> get events => _events.stream;
  bool get isConnected => _socket?.connected ?? false;

  Future<void> connect() async {
    if (_socket != null && _socket!.connected) return;
    final token = await _storage.read(key: AppConstants.kAccessToken);

    _socket = io.io(
      AppConstants.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _socket!.onConnect((_) => _emit('connect', {}));
    _socket!.onDisconnect((_) => _emit('disconnect', {}));

    for (final ev in _allEvents) {
      _socket!.on(ev, (data) => _emit(ev, data));
    }
  }

  void joinRoom(String roomId) => _socket?.emit(SocketEvents.joinRoom, {'roomId': roomId});
  void leaveRoom(String roomId) => _socket?.emit(SocketEvents.leaveRoom, {'roomId': roomId});

  void requestSeat(String roomId, int seatIndex) =>
      _socket?.emit(SocketEvents.seatRequest, {'roomId': roomId, 'seatIndex': seatIndex});
  void acceptSeat(String roomId, String userId, int seatIndex) =>
      _socket?.emit(SocketEvents.seatAccept, {'roomId': roomId, 'userId': userId, 'seatIndex': seatIndex});
  void rejectSeat(String roomId, String userId) =>
      _socket?.emit(SocketEvents.seatReject, {'roomId': roomId, 'userId': userId});
  void leaveSeat(String roomId) => _socket?.emit(SocketEvents.seatLeave, {'roomId': roomId});
  void toggleMute(String roomId, bool muted, {String? targetUserId}) =>
      _socket?.emit(SocketEvents.seatMute, {'roomId': roomId, 'muted': muted, if (targetUserId != null) 'targetUserId': targetUserId});
  void kickUser(String roomId, String userId) =>
      _socket?.emit(SocketEvents.seatKick, {'roomId': roomId, 'userId': userId});
  void banUser(String roomId, String userId) =>
      _socket?.emit(SocketEvents.seatBan, {'roomId': roomId, 'userId': userId});
  void lockSeat(String roomId, int seatIndex, bool locked) =>
      _socket?.emit(SocketEvents.seatLock, {'roomId': roomId, 'seatIndex': seatIndex, 'locked': locked});
  void muteAll(String roomId, bool muted) =>
      _socket?.emit(SocketEvents.muteAll, {'roomId': roomId, 'muted': muted});

  void sendGift(String roomId, String giftId, String receiverId, {int quantity = 1}) =>
      _socket?.emit(SocketEvents.giftSend, {'roomId': roomId, 'giftId': giftId, 'receiverId': receiverId, 'quantity': quantity});

  void sendChat(String roomId, String text, {bool isPaid = false}) =>
      _socket?.emit(SocketEvents.chatMessage, {'roomId': roomId, 'text': text, 'isPaid': isPaid});

  void startPk(String roomId, String hostBId, {int durationSec = 300}) =>
      _socket?.emit(SocketEvents.pkStart, {'roomId': roomId, 'hostBId': hostBId, 'durationSec': durationSec});
  void supportPk(String roomId, String side, int coins) =>
      _socket?.emit(SocketEvents.pkSupport, {'roomId': roomId, 'side': side, 'coins': coins});

  void sendLuckBox(String roomId, int totalCoins, {int packets = 5, int ttlSec = 60}) =>
      _socket?.emit(SocketEvents.luckboxSend, {'roomId': roomId, 'totalCoins': totalCoins, 'packets': packets, 'ttlSec': ttlSec});

  void sendVoiceEffect(String roomId, String effect) =>
      _socket?.emit(SocketEvents.voiceEffect, {'roomId': roomId, 'effect': effect});

  void _emit(String type, dynamic data) {
    if (!_events.isClosed) _events.add(SocketEvent(type, data));
  }

  void disconnect() {
    _socket?.dispose();
    _socket = null;
  }

  static const List<String> _allEvents = [
    SocketEvents.roomState, SocketEvents.userJoined, SocketEvents.userLeft,
    SocketEvents.seatRequest, SocketEvents.seatAccept, SocketEvents.seatReject,
    SocketEvents.seatLeave, SocketEvents.seatMute, SocketEvents.seatKick,
    SocketEvents.seatBan, SocketEvents.seatLock, SocketEvents.giftReceived,
    SocketEvents.giftError, SocketEvents.chatMessage, SocketEvents.chatHistory,
    SocketEvents.chatBlocked, SocketEvents.walletUpdate, SocketEvents.muteAll,
    SocketEvents.pkUpdate, SocketEvents.luckboxNew, SocketEvents.voiceEffect,
  ];
}

class SocketEvent {
  final String type;
  final dynamic data;
  SocketEvent(this.type, this.data);
}
