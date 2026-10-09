import 'package:equatable/equatable.dart';

class PostComment extends Equatable {
  final String userId;
  final String username;
  final String text;
  const PostComment({required this.userId, required this.username, required this.text});

  factory PostComment.fromJson(Map<String, dynamic> j) {
    final u = j['userId'];
    final m = u is Map ? u : null;
    return PostComment(
      userId: m?['_id']?.toString() ?? u?.toString() ?? '',
      username: m?['username'] ?? '',
      text: j['text'] ?? '',
    );
  }

  @override
  List<Object?> get props => [userId, text];
}

class Post extends Equatable {
  final String id;
  final String authorId;
  final String authorName;
  final String authorAvatar;
  final String text;
  final List<String> images;
  final String audioUrl;
  final String roomName;
  final String roomCover;
  final String? roomId;
  final int likes;
  final bool liked;
  final List<PostComment> comments;
  final int shares;
  final DateTime createdAt;

  const Post({
    required this.id,
    required this.authorId,
    this.authorName = '',
    this.authorAvatar = '',
    this.text = '',
    this.images = const [],
    this.audioUrl = '',
    this.roomName = '',
    this.roomCover = '',
    this.roomId,
    this.likes = 0,
    this.liked = false,
    this.comments = const [],
    this.shares = 0,
    required this.createdAt,
  });

  factory Post.fromJson(Map<String, dynamic> j) {
    final a = j['authorId'];
    final am = a is Map ? a : null;
    final rc = j['roomCard'];
    final rcm = rc is Map ? rc : null;
    return Post(
      id: j['_id'] ?? j['id'] ?? '',
      authorId: am?['_id']?.toString() ?? a?.toString() ?? '',
      authorName: am?['username'] ?? '',
      authorAvatar: am?['avatar'] ?? '',
      text: j['text'] ?? '',
      images: List<String>.from(j['images'] ?? const []),
      audioUrl: j['audioUrl'] ?? '',
      roomName: rcm?['name'] ?? '',
      roomCover: rcm?['cover'] ?? '',
      roomId: rcm?['roomId']?.toString(),
      likes: (j['likes'] as List?)?.length ?? 0,
      comments: (j['comments'] as List? ?? [])
          .map((e) => PostComment.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      shares: j['shares'] ?? 0,
      createdAt: DateTime.tryParse(j['createdAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }

  @override
  List<Object?> get props => [id, likes, shares];
}
