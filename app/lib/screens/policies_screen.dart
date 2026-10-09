import 'package:flutter/material.dart';

/// Privacy policy / GDPR screen.
class PoliciesScreen extends StatelessWidget {
  const PoliciesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0634\u0631\u0648\u0637')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ListTile(leading: Icon(Icons.lock_outline, size: 24), title: Text('\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629')),
          ListTile(leading: Icon(Icons.info_outline, size: 24), title: Text('\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645')),
          ListTile(leading: Icon(Icons.warning_amber_outlined, size: 24), title: Text('\u0627\u0644\u0625\u0628\u0644\u0627\u063a \u0639\u0646 \u0645\u062d\u062a\u0648\u0649')),
          ListTile(leading: Icon(Icons.person_outline, size: 24), title: Text('\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628')),
        ],
      ),
    );
  }
}
