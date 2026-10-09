import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../widgets/asset_button.dart';

/// Search users and rooms.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  List<User> _users = [];
  bool _loading = false;

  Future<void> _search() async {
    final q = _controller.text.trim();
    if (q.isEmpty) return;
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.get('/users/search', query: {'q': q});
      _users = (res['users'] as List? ?? []).map((e) => User.fromJson(Map<String, dynamic>.from(e))).toList();
    } catch (_) { _users = []; }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0628\u062d\u062b')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _controller,
              onSubmitted: (_) => _search(),
              decoration: const InputDecoration(hintText: '\u0627\u0628\u062d\u062b \u0639\u0646 \u0645\u0633\u062a\u062e\u062f\u0645...', prefixIcon: AssetIcon(A.search, size: 20)),
            ),
          ),
          if (_loading) const CircularProgressIndicator(),
          Expanded(
            child: ListView.builder(
              itemCount: _users.length,
              itemBuilder: (_, i) {
                final u = _users[i];
                return ListTile(
                  leading: CircleAvatar(backgroundImage: u.avatar.isNotEmpty ? NetworkImage(u.avatar) : null, child: u.avatar.isEmpty ? const AssetIcon(A.profile, size: 18) : null),
                  title: Text(u.username),
                  subtitle: Text('ID: ${u.userId}'),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
