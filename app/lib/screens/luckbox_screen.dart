import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Luck box / red envelope: open, timer, burst effect.
class LuckBoxScreen extends StatefulWidget {
  const LuckBoxScreen({super.key});
  @override
  State<LuckBoxScreen> createState() => _LuckBoxScreenState();
}

class _LuckBoxScreenState extends State<LuckBoxScreen> {
  bool _opened = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u062d\u0638')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(_opened ? A.luckboxOpen : A.luckboxClosed, height: 180, fit: BoxFit.contain),
            const SizedBox(height: 20),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              AssetIcon(A.luckboxTimer, size: 22),
              const SizedBox(width: 6),
              const Text('00:30', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ]),
            const SizedBox(height: 24),
            AssetButton(base: A.btnLuckBox, width: 220, height: 54, onPressed: () => setState(() => _opened = true)),
          ],
        ),
      ),
    );
  }
}
