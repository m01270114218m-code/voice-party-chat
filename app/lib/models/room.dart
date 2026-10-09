import 'package:equatable/equatable.dart';

/// A single mic seat inside a voice room.
class Seat extends Equatable {
  final int index;
  final String? userId;
  final String? username;
  final String? avatar;
  final bool isMuted;
  final bool isLocked;
  final int level;
  final String vipTier;

  const Seat({
    required this.index,
    this.userId,
    this.username,
    this.avatar,
    this.isMuted = false,
    this.isLocked = false,
    this.level = 1,
    this.vipTier = 'none',
  });

  bool get isEmpty => userId == null;
  bool get isHost => index == 0;

  factory Seat.fromJson(Map<String, dynamic> j) {
    final u = j['userId'];
    final populated = u is Map;
    return Seat(
      index: j['index'] ?? 0,
      userId: populated ? u['_id']?.toString() : u?.toString(),
      username: populated ? u['username'] : null,
      avatar: populated ? u['avatar'] : null,
      isMuted: j['isMuted'] ?? false,
      isLocked: j['isLocked'] ?? false,
      level: populated ? (u['level'] ?? 1) : 1,
      vipTier: populated ? (u['vipTier'] ?? 'none') : 'none',
    );
  }

  @override
  List<Object?> get props => [index, userId, isMuted, isLocked];
}

class Room extends Equatable {
  final String id;
  final String code;
  final String name;
  final String coverImage;
  final String category;
  final String ownerId;
  final String ownerName;
  final String ownerAvatar;
  final List<Seat> seats;
  final int listenerCount;
  final bool isLive;
  final bool isPrivate;
  final int totalGifts;
  final String agoraChannel;

  const Room({
    required this.id,
    this.code = '',
    required this.name,
    this.coverImage = '',
    this.category = 'chat',
    required this.ownerId,
    this.ownerName = '',
    this.ownerAvatar = '',
    this.seats = const [],
    this.listenerCount = 0,
    this.isLive = true,
    this.isPrivate = false,
    this.totalGifts = 0,
    this.agoraChannel = '',
  });

  factory Room.fromJson(Map<String, dynamic> j) {
    final owner = j['ownerId'];
    final ownerMap = owner is Map ? owner : null;
    return Room(
      id: j['_id'] ?? j['id'] ?? '',
      code: j['code'] ?? '',
      name: j['name'] ?? '',
      coverImage: j['coverImage'] ?? '',
      category: j['category'] ?? 'chat',
      ownerId: ownerMap != null ? (ownerMap['_id']?.toString() ?? '') : (owner?.toString() ?? ''),
      ownerName: ownerMap?['username'] ?? '',
      ownerAvatar: ownerMap?['avatar'] ?? '',
      seats: (j['seats'] as List? ?? [])
          .map((e) => Seat.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      listenerCount: j['listenerCount'] ?? (j['listeners'] as List?)?.length ?? 0,
      isLive: j['isLive'] ?? true,
      isPrivate: j['isPrivate'] ?? false,
      totalGifts: j['totalGifts'] ?? 0,
      agoraChannel: j['agoraChannel'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, name, seats, listenerCount, isLive];
}
