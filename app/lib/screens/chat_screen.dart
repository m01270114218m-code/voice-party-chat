import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/message.dart';
import '../widgets/asset_button.dart';

/// 1-on-1 chat with a friend.
class ChatScreen extends StatefulWidget {
  final Object? peer;
  const ChatScreen({super.key, this.peer});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final List<String> _messages = [];

  @override
  void dispose() { _controller.dispose(); super.dispose(); }

  void _send() {
    final t = _controller.text.trim();
    if (t.isEmpty) return;
    setState(() => _messages.add(t));
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('\u0645\u062d\u0627\u062f\u062b\u0629')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (_, i) => Align(
                alignment: Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(16)),
                  child: Text(_messages[_messages.length - 1 - i], style: const TextStyle(color: Colors.white)),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 6, 12, 12),
            child: Row(
              children: [
                Expanded(child: TextField(controller: _controller, onSubmitted: (_) => _send(), decoration: const InputDecoration(hintText: '\u0627\u0643\u062a\u0628 \u0631\u0633\u0627\u0644\u0629...'))),
                const SizedBox(width: 8),
                AssetIconButton(asset: A.send, size: 44, iconSize: 24, onPressed: _send),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
