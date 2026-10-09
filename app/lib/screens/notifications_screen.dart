import 'package:flutter/material.dart';
import '../services/api_service.dart';

/// Notifications list.
class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});
  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<Map<String, dynamic>> _items = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final res = await ApiService.instance.get('/notifications');
      _items = List<Map<String, dynamic>>.from((res['notifications'] as List? ?? []).map((e) => Map<String, dynamic>.from(e)));
    } catch (_) { _items = []; }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الإشعارات')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _items.isEmpty
              ? const Center(child: Text('لا توجد إشعارات', style: TextStyle(color: Colors.grey)))
              : ListView.builder(
                  itemCount: _items.length,
                  itemBuilder: (_, i) {
                    final n = _items[i];
                    return ListTile(
                      leading: const Icon(Icons.notifications_none, size: 24),
                      title: Text('${n['title'] ?? ''}'),
                      subtitle: Text('${n['body'] ?? ''}'),
                    );
                  },
                ),
    );
  }
}
