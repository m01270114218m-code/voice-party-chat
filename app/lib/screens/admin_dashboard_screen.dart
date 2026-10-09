import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Super-admin dashboard: withdrawals, reports, broadcasts.
class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0644\u0648\u062d\u0629 \u0627\u0644\u0625\u062f\u0627\u0631\u0629')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(children: [
            Expanded(child: _metric(A.coins, '\u0627\u0644\u0623\u0631\u0628\u0627\u062d', '0')),
            const SizedBox(width: 12),
            Expanded(child: _metric(A.profile, '\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646', '0')),
          ]),
          const SizedBox(height: 20),
          const Text('\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0633\u062d\u0628', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: AssetButton(base: A.btnApprove, height: 48, onPressed: () {})),
            const SizedBox(width: 10),
            Expanded(child: AssetButton(base: A.btnReject, height: 48, onPressed: () {})),
          ]),
          const SizedBox(height: 20),
          AssetButton(base: A.btnBroadcast, height: 52, onPressed: () {}),
        ],
      ),
    );
  }

  Widget _metric(String icon, String label, String value) => Container(
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.card(),
        child: Column(children: [
          AssetIcon(icon, size: 32),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
        ]),
      );
}
