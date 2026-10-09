import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../services/auth_service.dart';
import '../widgets/asset_button.dart';
import '../widgets/vip_badge.dart';
import 'settings_screen.dart';
import 'wallet_screen.dart';

/// User profile: avatar + frame, stats, VIP, and quick actions.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final u = AuthService.instance.currentUser;
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(image: AssetImage(A.bgProfile), fit: BoxFit.cover),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 8),
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                Image.asset(A.frameGold, width: 130, height: 130),
                ClipOval(
                  child: Image.asset(
                    u?.avatar.isNotEmpty == true ? u!.avatar : A.avatars[0],
                    width: 96, height: 96, fit: BoxFit.cover,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(u?.username ?? '\u0632\u0627\u0626\u0631',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 6),
          Center(child: VipBadge(tier: u?.vipTier ?? VipTier.none, level: u?.level ?? 1)),
          const SizedBox(height: 20),
          Row(
            children: [
              _stat('\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0648\u0646', '${u?.followers ?? 0}'),
              _stat('\u0623\u062a\u0627\u0628\u0639', '${u?.following ?? 0}'),
              _stat('\u0627\u0644\u0645\u0633\u062a\u0648\u0649', '${u?.level ?? 1}'),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: AssetButton(base: A.btnEditProfile, height: 50, onPressed: () {})),
              const SizedBox(width: 10),
              Expanded(child: AssetButton(base: A.btnWallet, height: 50, onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const WalletScreen())))),
            ],
          ),
          const SizedBox(height: 10),
          AssetButton(base: A.btnToolStore, height: 50, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnLogout, height: 50, onPressed: () async {
            await AuthService.instance.logout();
            if (context.mounted) Navigator.of(context).popUntil((r) => r.isFirst);
          }),
          const SizedBox(height: 10),
          AssetButton(base: A.btnDeleteAccount, height: 50, onPressed: () {}),
          const SizedBox(height: 10),
          AssetIconButton(asset: A.settings, onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()))),
        ],
      ),
    );
  }

  Widget _stat(String label, String value) => Expanded(
        child: Column(
          children: [
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          ],
        ),
      );
}
