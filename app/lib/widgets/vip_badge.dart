import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/user.dart';
import 'asset_button.dart';

/// VIP / level badge shown next to usernames.
class VipBadge extends StatelessWidget {
  final VipTier tier;
  final int level;
  final bool showLevel;

  const VipBadge({
    super.key,
    this.tier = VipTier.none,
    this.level = 1,
    this.showLevel = true,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (tier != VipTier.none)
          Container(
            margin: const EdgeInsets.only(right: 4),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AssetIcon(_tierIcon(tier), size: 12),
                const SizedBox(width: 2),
                Text(
                  _tierLabel(tier),
                  style: const TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                ),
              ],
            ),
          ),
        if (showLevel)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(.25),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.primary, width: .8),
            ),
            child: Text('Lv$level',
                style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary)),
          ),
      ],
    );
  }

  String _tierIcon(VipTier t) => switch (t) {
        VipTier.silver => A.vipSilver,
        VipTier.gold => A.vipGold,
        VipTier.diamond => A.vipDiamond,
        VipTier.none => A.vipSilver,
      };

  String _tierLabel(VipTier t) => switch (t) {
        VipTier.silver => 'SILVER',
        VipTier.gold => 'GOLD',
        VipTier.diamond => 'DIAMOND',
        VipTier.none => '',
      };
}
