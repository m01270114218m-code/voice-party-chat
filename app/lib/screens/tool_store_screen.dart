import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Tool store: frames, voice changers, entrance effects, bubbles.
class ToolStoreScreen extends StatelessWidget {
  const ToolStoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0645\u062a\u062c\u0631 \u0627\u0644\u0623\u062f\u0648\u0627\u062a')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('\u0625\u0637\u0627\u0631\u0627\u062a \u0627\u0644\u0628\u0631\u0648\u0641\u0627\u064a\u0644', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 4, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 10, crossAxisSpacing: 10,
            children: A.frames.map((f) => Image.asset(f, fit: BoxFit.contain)).toList(),
          ),
          const SizedBox(height: 20),
          const Text('\u0645\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0635\u0648\u062a', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(children: [
            AssetIcon(A.voiceChanger, size: 40), const SizedBox(width: 12),
            const Expanded(child: Text('\u0635\u0648\u062a \u0631\u0648\u0628\u0648\u062a\u060c \u0637\u0641\u0644\u060c \u0639\u0645\u0644\u0627\u0642...')),
          ]),
          const SizedBox(height: 20),
          AssetButton(base: A.btnBuyPack, height: 52, onPressed: () {}),
        ],
      ),
    );
  }
}
