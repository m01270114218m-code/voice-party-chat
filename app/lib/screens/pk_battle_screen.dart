import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// PK battle: two teams, progress bars, support, tomato/egg reactions.
class PkBattleScreen extends StatefulWidget {
  final String roomId;
  const PkBattleScreen({super.key, this.roomId = ''});
  @override
  State<PkBattleScreen> createState() => _PkBattleScreenState();
}

class _PkBattleScreenState extends State<PkBattleScreen> {
  double _red = .5, _blue = .5;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u062a\u062d\u062f\u064a PK')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(children: [
              Expanded(child: _team('\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u062d\u0645\u0631', A.pkBarRed, _red, AppTheme.danger)),
              Image.asset(A.pkVs, width: 60, height: 60),
              Expanded(child: _team('\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u0632\u0631\u0642', A.pkBarBlue, _blue, AppTheme.cyan)),
            ]),
            const SizedBox(height: 30),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              AssetIconButton(asset: A.pkTomato, size: 60, iconSize: 40, onPressed: () => setState(() => _red += .05)),
              const SizedBox(width: 20),
              AssetIconButton(asset: A.pkEgg, size: 60, iconSize: 40, onPressed: () => setState(() => _blue += .05)),
            ]),
            const SizedBox(height: 30),
            AssetButton(base: A.btnSupportHost, height: 52, onPressed: () {}),
            const SizedBox(height: 10),
            AssetButton(base: A.btnStartPk, height: 52, onPressed: () {}),
          ],
        ),
      ),
    );
  }

  Widget _team(String name, String bar, double v, Color c) => Column(
        children: [
          Text(name, style: TextStyle(fontWeight: FontWeight.bold, color: c)),
          const SizedBox(height: 8),
          Stack(alignment: Alignment.centerLeft, children: [
            Image.asset(bar, height: 22, fit: BoxFit.fill),
            FractionallySizedBox(widthFactor: v.clamp(0, 1), child: Container(height: 22, decoration: BoxDecoration(color: c.withOpacity(.5), borderRadius: BorderRadius.circular(11)))),
          ]),
          const SizedBox(height: 4),
          Text('${(v * 100).round()}%', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
        ],
      );
}
