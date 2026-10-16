import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../services/auth_service.dart';
import '../widgets/asset_button.dart';

/// Wallet: coin balance, diamond balance, recharge packs, withdraw.
class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final u = AuthService.instance.currentUser;
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(image: AssetImage(A.bgWallet), fit: BoxFit.cover),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _balance(A.coinIcon, '\u0627\u0644\u0639\u0645\u0644\u0627\u062a', '${u?.coins ?? 0}', AppTheme.gold)),
              const SizedBox(width: 12),
              Expanded(child: _balance(A.diamondIcon, '\u0627\u0644\u0645\u0627\u0633', '${u?.diamonds ?? 0}', AppTheme.cyan)),
            ],
          ),
          const SizedBox(height: 20),
          const Text('\u0628\u0627\u0642\u0627\u062a \u0627\u0644\u0634\u062d\u0646', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2, shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 1.5,
            children: [
              _pack('1000', '\$0.99'), _pack('5000', '\$4.99'),
              _pack('12000', '\$9.99'), _pack('30000', '\$19.99'),
            ],
          ),
          const SizedBox(height: 20),
          AssetButton(base: A.btnBuyPack, height: 52, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnConvertDiamond, height: 52, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnWithdraw, height: 52, onPressed: () {}),
        ],
      ),
    );
  }

  Widget _balance(String icon, String label, String value, Color c) => Container(
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.card(),
        child: Column(
          children: [
            AssetIcon(icon, size: 34),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: c)),
            Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          ],
        ),
      );

  Widget _pack(String coins, String price) => Container(
        decoration: AppTheme.card(),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AssetIcon(A.coinIcon, size: 30),
            const SizedBox(height: 6),
            Text(coins, style: const TextStyle(fontWeight: FontWeight.bold)),
            Text(price, style: const TextStyle(fontSize: 12, color: AppTheme.gold)),
          ],
        ),
      );
}
