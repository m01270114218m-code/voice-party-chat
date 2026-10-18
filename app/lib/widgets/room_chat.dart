import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/message.dart';
import '../models/user.dart';
import 'asset_button.dart';
import 'vip_badge.dart';

/// In-room text chat list + input bar.
class RoomChat extends StatelessWidget {
  final List<ChatMessage> messages;
  final TextEditingController controller;
  final VoidCallback onSend;

  const RoomChat({
    super.key,
    required this.messages,
    required this.controller,
    required this.onSend,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            reverse: true,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            itemCount: messages.length,
            itemBuilder: (_, i) {
              final m = messages[messages.length - 1 - i];
              if (m.type == MessageType.system) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3),
                  child: Text(m.text,
                      style: const TextStyle(
                          fontSize: 12, color: AppTheme.gold)),
                );
              }
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundImage: m.avatar.isNotEmpty
                          ? NetworkImage(m.avatar)
                          : null,
                      child: m.avatar.isEmpty
                          ? const Icon(Icons.person, size: 14)
                          : null,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(m.username,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.textMuted)),
                              ),
                              const SizedBox(width: 4),
                              VipBadge(
                                  tier: vipTierFromString(m.vipTier), level: m.level),
                            ],
                          ),
                          Text(m.text,
                              style: const TextStyle(
                                  fontSize: 13, color: AppTheme.textPrimary)),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        // Input
        Container(
          padding: const EdgeInsets.fromLTRB(12, 6, 12, 12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => onSend(),
                  decoration: const InputDecoration(
                    hintText: 'اكتب رسالة...',
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              AssetIconButton(
                asset: A.send,
                size: 44,
                iconSize: 24,
                onPressed: onSend,
              ),
            ],
          ),
        ),
      ],
    );
  }

  VipTier _tier(int v) =>
      VipTier.values[v.clamp(0, VipTier.values.length - 1)];
}
