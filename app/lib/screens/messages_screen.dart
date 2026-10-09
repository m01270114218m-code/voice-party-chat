import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/message.dart';
import '../services/api_service.dart';
import '../widgets/asset_button.dart';
import 'chat_screen.dart';

/// Direct-message inbox.
class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});
  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  List<Conversation> _items = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final res = await ApiService.instance.get('/messages/conversations');
      _items = (res['conversations'] as List? ?? [])
          .map((e) => Conversation.fromJson(Map<String, dynamic>.from(e))).toList();
    } catch (_) { _items = []; }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0627\u0644\u0631\u0633\u0627\u0626\u0644')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _items.isEmpty
              ? const Center(child: Text('\u0644\u0627 \u062a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644', style: TextStyle(color: AppTheme.textMuted)))
              : ListView.separated(
                  itemCount: _items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1, color: Colors.white10),
                  itemBuilder: (_, i) {
                    final c = _items[i];
                    return ListTile(
                      leading: Stack(children: [
                        CircleAvatar(backgroundImage: c.peerAvatar.isNotEmpty ? NetworkImage(c.peerAvatar) : null, child: c.peerAvatar.isEmpty ? const AssetIcon(A.profile, size: 20) : null),
                        Positioned(right: 0, bottom: 0, child: AssetIcon(c.presence == 'online' ? A.statusOnline : A.statusOffline, size: 12)),
                      ]),
                      title: Text(c.peerName),
                      subtitle: Text(c.lastMessage, maxLines: 1, overflow: TextOverflow.ellipsis),
                      trailing: c.unread > 0 ? CircleAvatar(radius: 10, backgroundColor: AppTheme.pink, child: Text('${c.unread}', style: const TextStyle(fontSize: 10))) : null,
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ChatScreen(peer: c))),
                    );
                  },
                ),
    );
  }
}
