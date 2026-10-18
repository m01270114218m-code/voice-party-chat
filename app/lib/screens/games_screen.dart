import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// In-room mini-games lobby: Ludo, Domino, Uno, Fortune Wheel.
class GamesScreen extends StatelessWidget {
  const GamesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final games = [
      (A.gameLudoBoard, '\u0644\u0648\u062f\u0648'),
      (A.gameDomino, '\u062f\u0648\u0645\u064a\u0646\u0648'),
      (A.gameUnoStack, '\u0623\u0648\u0646\u0648'),
      (A.gameWheel, '\u0639\u062c\u0644\u0629 \u0627\u0644\u062d\u0638'),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0623\u0644\u0639\u0627\u0628')),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2, mainAxisSpacing: 14, crossAxisSpacing: 14, childAspectRatio: .9,
        children: games.map((g) => Container(
          decoration: AppTheme.card(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(g.$1, height: 90, fit: BoxFit.contain),
              const SizedBox(height: 10),
              Text(g.$2, style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              AssetButton(base: A.btnInvitePlay, width: 130, height: 40, onPressed: () {}),
            ],
          ),
        )).toList(),
      ),
    );
  }
}
