import 'package:equatable/equatable.dart';

enum MessageType { text, system, gift, join, leave, voice, image, danmaku }

MessageType messageTypeFromString(String? v) => MessageType.values.firstWhere(
      (e) => e.name == v,
      orElse: () => MessageType.text,
    );

class ChatMessage extends Equatable {
  final String id;
  final String userId;
  final String username;
  final String avatar;
  final String text;
  final MessageType type;
  final bool isPaid;
  final int level;
  final String vipTier;
  final String mediaUrl;
  final int durationMs;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.userId,
    required this.username,
    this.avatar = '',
    required this.text,
    this.type = MessageType.text,
    this.isPaid = false,
    this.level = 1,
    this.vipTier = 'none',
    this.mediaUrl = '',
    this.durationMs = 0,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> j) => ChatMessage(
        id: j['_id'] ?? j['id'] ?? '',
        userId: j['userId']?.toString() ?? '',
        username: j['username'] ?? '',
        avatar: j['avatar'] ?? '',
        text: j['text'] ?? '',
        type: messageTypeFromString(j['type']),
        isPaid: j['isPaid'] ?? false,
        level: j['level'] ?? 1,
        vipTier: j['vipTier'] ?? 'none',
        mediaUrl: j['mediaUrl'] ?? '',
        durationMs: j['durationMs'] ?? 0,
        createdAt: DateTime.tryParse(j['createdAt']?.toString() ?? '') ?? DateTime.now(),
      );

  @override
  List<Object?> get props => [id, userId, text, createdAt];
}

/// A private conversation summary (inbox row).
class Conversation extends Equatable {
  final String peerId;
  final String peerName;
  final String peerAvatar;
  final String lastMessage;
  final DateTime lastAt;
  final int unread;
  final String presence; // online | offline | in_room

  const Conversation({
    required this.peerId,
    required this.peerName,
    this.peerAvatar = '',
    this.lastMessage = '',
    required this.lastAt,
    this.unread = 0,
    this.presence = 'offline',
  });

  factory Conversation.fromJson(Map<String, dynamic> j) {
    final peer = j['peer'] ?? {};
    return Conversation(
      peerId: peer['_id']?.toString() ?? '',
      peerName: peer['username'] ?? '',
      peerAvatar: peer['avatar'] ?? '',
      lastMessage: j['lastMessage'] ?? '',
      lastAt: DateTime.tryParse(j['lastAt']?.toString() ?? '') ?? DateTime.now(),
      unread: j['unread'] ?? 0,
      presence: j['presence'] ?? 'offline',
    );
  }

  @override
  List<Object?> get props => [peerId, lastMessage, unread];
}
