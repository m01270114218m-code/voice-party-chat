import 'package:equatable/equatable.dart';

/// VIP tier levels.
enum VipTier { none, silver, gold, diamond }

VipTier vipTierFromString(String? v) {
  switch (v) {
    case 'silver': return VipTier.silver;
    case 'gold': return VipTier.gold;
    case 'diamond': return VipTier.diamond;
    default: return VipTier.none;
  }
}

String vipTierLabel(VipTier t) =>
    const ['None', 'Silver', 'Gold', 'Diamond'][t.index];

class User extends Equatable {
  final String id;
  final String userId;      // public 8-digit ID
  final String username;
  final String? email;
  final String avatar;
  final String avatarFrame;
  final String bio;
  final String country;
  final int level;
  final int xp;
  final VipTier vipTier;
  final int coins;          // purchased currency
  final int diamonds;       // earned from gifts
  final int wealthLevel;    // supporter matrix
  final int talentLevel;    // talent matrix
  final int followers;
  final int following;
  final List<String> badges;
  final String role;
  final bool isGuest;
  final String? familyId;

  const User({
    required this.id,
    this.userId = '',
    required this.username,
    this.email,
    this.avatar = '',
    this.avatarFrame = '',
    this.bio = '',
    this.country = '',
    this.level = 1,
    this.xp = 0,
    this.vipTier = VipTier.none,
    this.coins = 0,
    this.diamonds = 0,
    this.wealthLevel = 1,
    this.talentLevel = 1,
    this.followers = 0,
    this.following = 0,
    this.badges = const [],
    this.role = 'user',
    this.isGuest = false,
    this.familyId,
  });

  factory User.fromJson(Map<String, dynamic> j) => User(
        id: j['_id'] ?? j['id'] ?? '',
        userId: j['userId'] ?? '',
        username: j['username'] ?? '',
        email: j['email'],
        avatar: j['avatar'] ?? '',
        avatarFrame: j['avatarFrame'] ?? '',
        bio: j['bio'] ?? '',
        country: j['country'] ?? '',
        level: j['level'] ?? 1,
        xp: j['xp'] ?? 0,
        vipTier: vipTierFromString(j['vipTier']),
        coins: j['coins'] ?? 0,
        diamonds: j['diamonds'] ?? 0,
        wealthLevel: j['wealthLevel'] ?? 1,
        talentLevel: j['talentLevel'] ?? 1,
        followers: j['followers'] ?? 0,
        following: j['following'] ?? 0,
        badges: List<String>.from(j['badges'] ?? const []),
        role: j['role'] ?? 'user',
        isGuest: j['isGuest'] ?? false,
        familyId: j['familyId']?.toString(),
      );

  Map<String, dynamic> toJson() => {
        '_id': id, 'userId': userId, 'username': username, 'email': email,
        'avatar': avatar, 'avatarFrame': avatarFrame, 'bio': bio, 'country': country,
        'level': level, 'xp': xp, 'vipTier': vipTier.name, 'coins': coins,
        'diamonds': diamonds, 'wealthLevel': wealthLevel, 'talentLevel': talentLevel,
        'followers': followers, 'following': following, 'badges': badges,
        'role': role, 'isGuest': isGuest, 'familyId': familyId,
      };

  User copyWith({
    int? coins, int? diamonds, int? level, int? xp, VipTier? vipTier,
    String? username, String? bio, String? avatar, String? avatarFrame,
  }) =>
      User(
        id: id, userId: userId, username: username ?? this.username, email: email,
        avatar: avatar ?? this.avatar, avatarFrame: avatarFrame ?? this.avatarFrame,
        bio: bio ?? this.bio, country: country, level: level ?? this.level,
        xp: xp ?? this.xp, vipTier: vipTier ?? this.vipTier, coins: coins ?? this.coins,
        diamonds: diamonds ?? this.diamonds, wealthLevel: wealthLevel,
        talentLevel: talentLevel, followers: followers, following: following,
        badges: badges, role: role, isGuest: isGuest, familyId: familyId,
      );

  @override
  List<Object?> get props => [id, username, level, vipTier, coins, diamonds];
}
