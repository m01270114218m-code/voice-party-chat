import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Agency / reseller panel: coin conversion and sub-agent management.
class ResellerScreen extends StatelessWidget {
  const ResellerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0644\u0648\u062d\u0629 \u0627\u0644\u0648\u0643\u064a\u0644')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: AppTheme.card(),
            child: Row(children: [
              AssetIcon(A.coins, size: 40),
              const SizedBox(width: 12),
              const Expanded(child: Text('\u0631\u0635\u064a\u062f \u0627\u0644\u0639\u0645\u0648\u0644\u0629', style: TextStyle(fontWeight: FontWeight.bold))),
              const Text('0', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.gold)),
            ]),
          ),
          const SizedBox(height: 16),
          AssetButton(base: A.btnConvertCoins, height: 52, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnBroadcast, height: 52, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnBlockDevice, height: 52, onPressed: () {}),
        ],
      ),
    );
  }
}
