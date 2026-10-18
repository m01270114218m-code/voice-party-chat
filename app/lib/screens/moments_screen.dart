import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/post.dart';
import '../services/api_service.dart';
import '../widgets/asset_button.dart';

/// Moments feed: posts with like / comment / share.
class MomentsScreen extends StatefulWidget {
  const MomentsScreen({super.key});
  @override
  State<MomentsScreen> createState() => _MomentsScreenState();
}

class _MomentsScreenState extends State<MomentsScreen> {
  List<Post> _posts = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final res = await ApiService.instance.get('/posts');
      _posts = (res['posts'] as List? ?? []).map((e) => Post.fromJson(Map<String, dynamic>.from(e))).toList();
    } catch (_) { _posts = []; }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0644\u062d\u0638\u0627\u062a')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _posts.length,
              itemBuilder: (_, i) {
                final p = _posts[i];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: AppTheme.card(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        CircleAvatar(backgroundImage: p.authorAvatar.isNotEmpty ? NetworkImage(p.authorAvatar) : null, child: p.authorAvatar.isEmpty ? const AssetIcon(A.profile, size: 18) : null),
                        const SizedBox(width: 8),
                        Text(p.authorName, style: const TextStyle(fontWeight: FontWeight.bold)),
                      ]),
                      const SizedBox(height: 10),
                      Text(p.text),
                      const SizedBox(height: 12),
                      Row(children: [
                        AssetIcon(A.like, size: 20), const SizedBox(width: 4), Text('${p.likes}'),
                        const SizedBox(width: 16),
                        AssetIcon(A.comment, size: 20), const SizedBox(width: 4), Text('${p.comments.length}'),
                        const SizedBox(width: 16),
                        AssetIcon(A.share, size: 20), const SizedBox(width: 4), Text('${p.shares}'),
                      ]),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
