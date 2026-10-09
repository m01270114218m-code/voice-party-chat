import 'package:equatable/equatable.dart';

class Family extends Equatable {
  final String id;
  final String name;
  final String logo;
  final String ownerId;
  final String ownerName;
  final int memberCount;
  final int weeklyScore;
  final int level;
  final String description;

  const Family({
    required this.id,
    required this.name,
    this.logo = '',
    this.ownerId = '',
    this.ownerName = '',
    this.memberCount = 0,
    this.weeklyScore = 0,
    this.level = 1,
    this.description = '',
  });

  factory Family.fromJson(Map<String, dynamic> j) {
    final o = j['ownerId'];
    final om = o is Map ? o : null;
    return Family(
      id: j['_id'] ?? j['id'] ?? '',
      name: j['name'] ?? '',
      logo: j['logo'] ?? '',
      ownerId: om?['_id']?.toString() ?? o?.toString() ?? '',
      ownerName: om?['username'] ?? '',
      memberCount: (j['members'] as List?)?.length ?? 0,
      weeklyScore: j['weeklyScore'] ?? 0,
      level: j['level'] ?? 1,
      description: j['description'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, name, weeklyScore];
}

class RechargePackage extends Equatable {
  final String id;
  final int coins;
  final double priceUsd;
  final int bonus;
  const RechargePackage({required this.id, required this.coins, required this.priceUsd, this.bonus = 0});

  factory RechargePackage.fromJson(Map<String, dynamic> j) => RechargePackage(
        id: j['id'] ?? '',
        coins: j['coins'] ?? 0,
        priceUsd: (j['priceUsd'] ?? 0).toDouble(),
        bonus: j['bonus'] ?? 0,
      );

  int get totalCoins => coins + bonus;

  @override
  List<Object?> get props => [id, coins, priceUsd];
}

class MiniGame extends Equatable {
  final String id;
  final String name;
  final int minPlayers;
  final int maxPlayers;
  final int entryCoins;
  const MiniGame({required this.id, required this.name, this.minPlayers = 2, this.maxPlayers = 4, this.entryCoins = 0});

  factory MiniGame.fromJson(Map<String, dynamic> j) => MiniGame(
        id: j['id'] ?? '',
        name: j['name'] ?? '',
        minPlayers: j['minPlayers'] ?? 2,
        maxPlayers: j['maxPlayers'] ?? 4,
        entryCoins: j['entryCoins'] ?? 0,
      );

  @override
  List<Object?> get props => [id, name];
}
