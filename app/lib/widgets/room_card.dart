import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/room.dart';
import 'asset_button.dart';

/// Room card for the home grid — cover image, live badge, listener count.
class RoomCard extends StatelessWidget {
  final Room room;
  final VoidCallback onTap;

  const RoomCard({super.key, required this.room, required this.onTap});

  /// Deterministic room cover chosen from the bundled room backgrounds so a
  /// card never shows an empty gradient while a network image is unavailable.
  String _fallbackCover(Room room) {
    final pool = A.roomBackgrounds;
    return pool[room.id.hashCode.abs() % pool.length];
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: AppTheme.surface,
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Cover
            room.coverImage.isNotEmpty
                ? Image.network(room.coverImage, fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Image.asset(
                        _fallbackCover(room), fit: BoxFit.cover))
                : Image.asset(_fallbackCover(room), fit: BoxFit.cover),
            // Dark gradient for legibility
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black87],
                ),
              ),
            ),
            // LIVE badge
            Positioned(
              top: 8,
              left: 8,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  gradient: AppTheme.liveGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AssetIcon(A.live, size: 12),
                    SizedBox(width: 4),
                    Text('LIVE',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white)),
                  ],
                ),
              ),
            ),
            // Listeners
            Positioned(
              top: 8,
              right: 8,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const AssetIcon(A.headset, size: 12),
                    const SizedBox(width: 3),
                    Text('${room.listenerCount}',
                        style: const TextStyle(
                            fontSize: 10, color: Colors.white)),
                  ],
                ),
              ),
            ),
            // Name + category
            Positioned(
              left: 10,
              right: 10,
              bottom: 10,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(room.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Colors.white)),
                  const SizedBox(height: 2),
                  Text(room.category,
                      style: const TextStyle(
                          fontSize: 11, color: AppTheme.textMuted)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
