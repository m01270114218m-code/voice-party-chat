import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/family.dart';
import '../services/api_service.dart';
import '../widgets/asset_button.dart';

/// Families / guilds: list, create, join.
class FamiliesScreen extends StatefulWidget {
  const FamiliesScreen({super.key});
  @override
  State<FamiliesScreen> createState() => _FamiliesScreenState();
}

class _FamiliesScreenState extends State<FamiliesScreen> {
  List<Family> _families = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final res = await ApiService.instance.get('/families');
      _families = (res['families'] as List? ?? []).map((e) => Family.fromJson(Map<String, dynamic>.from(e))).toList();
    } catch (_) { _families = []; }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: AssetButton(base: A.btnCreateFamily, height: 52, onPressed: () {}),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _families.length,
                    itemBuilder: (_, i) {
                      final f = _families[i];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(12),
                        decoration: AppTheme.card(),
                        child: Row(
                          children: [
                            Image.asset(A.familyShield, width: 46, height: 46),
                            const SizedBox(width: 12),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(f.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text('${f.memberCount} \u0639\u0636\u0648 \u00b7 \u0645\u0633\u062a\u0648\u0649 ${f.level}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                            ])),
                            AssetButton(base: A.btnJoinFamily, width: 100, height: 40, onPressed: () {}),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
