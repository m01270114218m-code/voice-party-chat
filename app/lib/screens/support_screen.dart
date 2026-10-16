import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';

/// Help / report center: submit a ticket or report a user.
class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});
  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  final _controller = TextEditingController();

  @override
  void dispose() { _controller.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u062f\u0639\u0645 \u0648\u0627\u0644\u0625\u0628\u0644\u0627\u063a')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('\u0623\u0631\u0633\u0644 \u062a\u0630\u0643\u0631\u0629', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          TextField(controller: _controller, maxLines: 5, decoration: const InputDecoration(hintText: '\u0627\u0634\u0631\u062d \u0645\u0634\u0643\u0644\u062a\u0643...')),
          const SizedBox(height: 16),
          AssetButton(base: A.btnSendTicket, height: 52, onPressed: () {}),
          const SizedBox(height: 10),
          AssetButton(base: A.btnReport, height: 52, onPressed: () {}),
        ],
      ),
    );
  }
}
