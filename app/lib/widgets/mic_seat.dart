import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/room.dart';
import 'asset_button.dart';

/// A single mic seat. Shows avatar, level, mute state, or an empty "+" slot.
class MicSeat extends StatelessWidget {
  final Seat seat;
  final bool isHost;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;

  const MicSeat({
    super.key,
    required this.seat,
    this.isHost = false,
    this.onTap,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    final empty = seat.isEmpty;
    return GestureDetector(
      onTap: onTap,
      onLongPress: onLongPress,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              // Ring
              SizedBox(
                width: 66,
                height: 66,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Image.asset(
                      empty
                          ? (seat.isLocked ? A.seatLocked : A.seatEmpty)
                          : A.seatOccupied,
                      width: 66,
                      height: 66,
                      fit: BoxFit.contain,
                    ),
                    if (!empty)
                      ClipOval(
                        child: SizedBox(
                          width: 46,
                          height: 46,
                          child: seat.avatar != null && seat.avatar!.isNotEmpty
                              ? Image.network(seat.avatar!, fit: BoxFit.cover)
                              : Image.asset(A.avatars[0], fit: BoxFit.cover),
                        ),
                      ),
                    if (empty && seat.isLocked)
                      const AssetIcon(A.lock, size: 18),
                  ],
                ),
              ),
              // Mute badge
              if (!empty && seat.isMuted)
                Positioned(
                  right: -2,
                  bottom: -2,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: Colors.redAccent,
                      shape: BoxShape.circle,
                    ),
                    child: const AssetIcon(A.micOff, size: 12),
                  ),
                ),
              // Host crown
              if (isHost)
                const Positioned(
                  top: -12,
                  child: AssetIcon(A.crown, size: 22),
                ),
            ],
          ),
          const SizedBox(height: 6),
          SizedBox(
            width: 70,
            child: Text(
              empty ? 'مقعد ${seat.index + 1}' : (seat.username ?? ''),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}
