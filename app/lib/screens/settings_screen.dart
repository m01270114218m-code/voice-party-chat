import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Settings: account, privacy, notifications, language, logout.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _tile(A.profile, '\u0627\u0644\u062d\u0633\u0627\u0628'),
          _tile(A.lock, '\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629'),
          _tile(A.bell, '\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a'),
          _tile(A.translate, '\u0627\u0644\u0644\u063a\u0629'),
          _tile(A.voiceChanger, '\u0645\u063a\u064a\u0631 \u0627\u0644\u0635\u0648\u062a'),
          _tile(A.block, '\u0627\u0644\u0645\u062d\u0638\u0648\u0631\u0648\u0646'),
          const SizedBox(height: 20),
          AssetButton(base: A.btnLogout, height: 52, onPressed: () => Navigator.pop(context)),
          const SizedBox(height: 10),
          AssetButton(base: A.btnDeleteAccount, height: 52, onPressed: () {}),
        ],
      ),
    );
  }

  Widget _tile(String icon, String title) => ListTile(
        leading: AssetIcon(icon, size: 24),
        title: Text(title),
        trailing: const Icon(Icons.chevron_left, color: AppTheme.textMuted),
        onTap: () {},
      );
}
