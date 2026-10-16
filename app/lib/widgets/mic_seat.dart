import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/room.dart';
import 'asset_button.dart';

/// Premium room seat: distinct empty, locked, occupied and muted states.
class MicSeat extends StatelessWidget {
  final Seat seat;
  final bool isHost;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  const MicSeat({super.key, required this.seat, this.isHost = false, this.onTap, this.onLongPress});

  @override
  Widget build(BuildContext context) {
    final empty = seat.isEmpty;
    final locked = empty && seat.isLocked;
    final muted = !empty && seat.isMuted;
    final accent = locked ? const Color(0xFF7C8198) : muted ? const Color(0xFFFF5C78) : isHost ? AppTheme.gold : const Color(0xFF9B6CFF);
    final label = locked ? 'المايك ' + (seat.index + 1).toString() + ' مقفول' : empty ? 'المايك ' + (seat.index + 1).toString() + ' متاح' : 'مايك ' + (seat.username ?? '') + (muted ? ' مكتوم' : '');
    return Semantics(
      button: onTap != null,
      label: label,
      child: GestureDetector(
        onTap: onTap, onLongPress: onLongPress, behavior: HitTestBehavior.opaque,
        child: SizedBox(width: 78, child: Column(mainAxisSize: MainAxisSize.min, children: [
          SizedBox(width: 70, height: 70, child: Stack(alignment: Alignment.center, clipBehavior: Clip.none, children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 240), width: 66, height: 66,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [accent.withOpacity(locked ? .20 : .42), const Color(0xFF171329), const Color(0xFF090914)]),
                border: Border.all(color: accent.withOpacity(locked ? .48 : .95), width: isHost ? 2.2 : 1.5),
                boxShadow: [BoxShadow(color: accent.withOpacity(locked ? .08 : .26), blurRadius: isHost ? 18 : 12, spreadRadius: 1), const BoxShadow(color: Color(0x99000000), blurRadius: 7, offset: Offset(0, 4))],
              ),
            ),
            Image.asset(locked ? A.seatLocked : empty ? A.seatEmpty : muted ? A.seatMuted : A.seatBusy, width: 66, height: 66, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const SizedBox.shrink()),
            if (!empty) Container(
              width: 46, height: 46, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: muted ? const Color(0xFFFF647D) : AppTheme.gold, width: 1.6)),
              child: ClipOval(child: seat.avatar != null && seat.avatar!.isNotEmpty ? Image.network(seat.avatar!, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Image.asset(A.avatar1, fit: BoxFit.cover)) : Image.asset(A.avatar1, fit: BoxFit.cover)),
            ),
            if (empty && !locked) Container(
              width: 38, height: 38, decoration: BoxDecoration(shape: BoxShape.circle, gradient: LinearGradient(colors: [const Color(0xFFB78AFF).withOpacity(.24), const Color(0xFF5126A8).withOpacity(.10)])),
              child: Center(child: Image.asset(A.micBtn, width: 25, height: 25, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.mic_rounded, color: Color(0xFFE8D9FF), size: 24))),
            ),
            if (locked) Container(width: 36, height: 36, decoration: const BoxDecoration(color: Color(0xCC11111F), shape: BoxShape.circle), child: const AssetIcon(A.lock, size: 19)),
            if (muted) Positioned(right: 0, bottom: 0, child: Container(width: 23, height: 23, decoration: BoxDecoration(color: const Color(0xFF30101D), shape: BoxShape.circle, border: Border.all(color: const Color(0xFFFF647D), width: 1.4)), child: const AssetIcon(A.micOff, size: 13))),
            if (isHost) Positioned(top: -8, child: Image.asset(A.royalCrown, width: 27, height: 23, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.workspace_premium_rounded, color: AppTheme.gold, size: 24))),
          ])),
          const SizedBox(height: 5),
          Container(
            constraints: const BoxConstraints(minHeight: 18), padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
            decoration: BoxDecoration(color: const Color(0xB30B0A18), borderRadius: BorderRadius.circular(8), border: Border.all(color: accent.withOpacity(.28))),
            child: Text(locked ? 'مقفول' : empty ? 'مايك ' + (seat.index + 1).toString() : (seat.username ?? 'مستخدم'), maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center,
              style: TextStyle(fontSize: 10.5, height: 1.1, fontWeight: empty ? FontWeight.w500 : FontWeight.w700, color: locked ? AppTheme.textMuted : const Color(0xFFF5F0FF))),
          ),
        ])),
      ),
    );
  }
}
