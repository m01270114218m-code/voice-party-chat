import 'api_service.dart';
import '../models/room.dart';
import '../models/post.dart';
import '../models/family.dart';

/// Rooms API wrapper.
class RoomService {
  RoomService._();
  static final RoomService instance = RoomService._();
  final _api = ApiService.instance;

  Future<List<Room>> listRooms({String category = 'all', String? q}) async {
    final res = await _api.get('/rooms', query: {'category': category, if (q != null) 'q': q});
    return (res['rooms'] as List? ?? []).map((e) => Room.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  Future<Room> getRoom(String id) async {
    final res = await _api.get('/rooms/$id');
    return Room.fromJson(Map<String, dynamic>.from(res['room']));
  }

  Future<Map<String, dynamic>> createRoom({
    required String name,
    String category = 'chat',
    bool isPrivate = false,
    String password = '',
    String coverImage = '',
  }) async =>
      _api.post('/rooms', data: {
        'name': name, 'category': category, 'isPrivate': isPrivate,
        'password': password, 'coverImage': coverImage,
      });

  Future<Map<String, dynamic>> joinRoom(String id, {String? password}) async =>
      _api.post('/rooms/$id/join', data: {if (password != null) 'password': password});

  Future<void> leaveRoom(String id) async => _api.post('/rooms/$id/leave');

  Future<List<Room>> myRooms() async {
    final res = await _api.get('/rooms/mine/list');
    return (res['rooms'] as List? ?? []).map((e) => Room.fromJson(Map<String, dynamic>.from(e))).toList();
  }
}

/// Moments / posts API wrapper.
class PostService {
  PostService._();
  static final PostService instance = PostService._();
  final _api = ApiService.instance;

  Future<List<Post>> list({String tab = 'recommended', String scope = 'all'}) async {
    final res = await _api.get('/posts', query: {'tab': tab, 'scope': scope});
    return (res['posts'] as List? ?? []).map((e) => Post.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  Future<Post> create({String text = '', List<String> images = const [], String audioUrl = '', Map<String, dynamic>? roomCard}) async {
    final res = await _api.post('/posts', data: {'text': text, 'images': images, 'audioUrl': audioUrl, 'roomCard': roomCard});
    return Post.fromJson(Map<String, dynamic>.from(res['post']));
  }

  Future<Map<String, dynamic>> like(String id) async => _api.post('/posts/$id/like');
  Future<Map<String, dynamic>> comment(String id, String text) async => _api.post('/posts/$id/comment', data: {'text': text});
  Future<Map<String, dynamic>> share(String id) async => _api.post('/posts/$id/share');
}

/// Families / tribes API wrapper.
class FamilyService {
  FamilyService._();
  static final FamilyService instance = FamilyService._();
  final _api = ApiService.instance;

  Future<List<Family>> leaderboard() async {
    final res = await _api.get('/families/leaderboard');
    return (res['families'] as List? ?? []).map((e) => Family.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  Future<Family?> mine() async {
    final res = await _api.get('/families/mine');
    final f = res['family'];
    return f == null ? null : Family.fromJson(Map<String, dynamic>.from(f));
  }

  Future<Family> create({required String name, String logo = '', String description = ''}) async {
    final res = await _api.post('/families', data: {'name': name, 'logo': logo, 'description': description});
    return Family.fromJson(Map<String, dynamic>.from(res['family']));
  }

  Future<void> requestJoin(String id) async => _api.post('/families/$id/join');
  Future<void> approve(String id, String userId) async => _api.post('/families/$id/approve', data: {'userId': userId});
}

/// Mini-games API wrapper.
class GameService {
  GameService._();
  static final GameService instance = GameService._();
  final _api = ApiService.instance;

  Future<List<MiniGame>> list() async {
    final res = await _api.get('/games');
    return (res['games'] as List? ?? []).map((e) => MiniGame.fromJson(Map<String, dynamic>.from(e))).toList();
  }

  Future<Map<String, dynamic>> challenge(String gameId, String userId, String roomId) async =>
      _api.post('/games/$gameId/challenge', data: {'userId': userId, 'roomId': roomId});

  Future<Map<String, dynamic>> result(String gameId, {required bool won, int reward = 0}) async =>
      _api.post('/games/$gameId/result', data: {'won': won, 'reward': reward});
}

/// Support & reports API wrapper.
class SupportService {
  SupportService._();
  static final SupportService instance = SupportService._();
  final _api = ApiService.instance;

  Future<List<Map<String, dynamic>>> faq() async {
    final res = await _api.get('/support/faq');
    return List<Map<String, dynamic>>.from(res['faq'] ?? []);
  }

  Future<Map<String, dynamic>> createTicket({required String subject, String category = 'general', String body = '', List<String> images = const []}) async =>
      _api.post('/support/tickets', data: {'subject': subject, 'category': category, 'body': body, 'images': images});

  Future<List<Map<String, dynamic>>> myTickets() async {
    final res = await _api.get('/support/tickets');
    return List<Map<String, dynamic>>.from(res['tickets'] ?? []);
  }

  Future<Map<String, dynamic>> report({required String targetType, required String targetId, String category = 'other', String reason = '', List<String> images = const []}) async =>
      _api.post('/support/report', data: {'targetType': targetType, 'targetId': targetId, 'category': category, 'reason': reason, 'images': images});
}

/// Reseller (agent) API wrapper.
class ResellerService {
  ResellerService._();
  static final ResellerService instance = ResellerService._();
  final _api = ApiService.instance;

  Future<Map<String, dynamic>> balance() async => _api.get('/reseller/balance');
  Future<Map<String, dynamic>> transfer({required String customerUserId, required int coins}) async =>
      _api.post('/reseller/transfer', data: {'customerUserId': customerUserId, 'coins': coins});
  Future<List<Map<String, dynamic>>> history() async {
    final res = await _api.get('/reseller/history');
    return List<Map<String, dynamic>>.from(res['transactions'] ?? []);
  }
}

/// Admin dashboard API wrapper.
class AdminService {
  AdminService._();
  static final AdminService instance = AdminService._();
  final _api = ApiService.instance;

  Future<Map<String, dynamic>> stats() async => _api.get('/admin/stats');
  Future<List<Map<String, dynamic>>> users({String? q}) async {
    final res = await _api.get('/admin/users', query: {if (q != null) 'q': q});
    return List<Map<String, dynamic>>.from(res['users'] ?? []);
  }
  Future<void> banUser(String id, {String reason = 'policy_violation'}) async => _api.post('/admin/users/$id/ban', data: {'reason': reason});
  Future<void> unbanUser(String id) async => _api.post('/admin/users/$id/unban');
  Future<void> banDevice({String? deviceId, String? ip, String reason = 'abuse'}) async =>
      _api.post('/admin/ban-device', data: {'deviceId': deviceId, 'ip': ip, 'reason': reason});
  Future<List<Map<String, dynamic>>> rooms() async {
    final res = await _api.get('/admin/rooms');
    return List<Map<String, dynamic>>.from(res['rooms'] ?? []);
  }
  Future<void> closeRoom(String id) async => _api.post('/admin/rooms/$id/close');
  Future<List<Map<String, dynamic>>> withdrawals() async {
    final res = await _api.get('/admin/withdrawals');
    return List<Map<String, dynamic>>.from(res['withdrawals'] ?? []);
  }
  Future<void> decideWithdrawal(String id, {required bool approve, String note = ''}) async =>
      _api.post('/admin/withdrawals/$id/decide', data: {'approve': approve, 'note': note});
  Future<List<Map<String, dynamic>>> reports() async {
    final res = await _api.get('/admin/reports');
    return List<Map<String, dynamic>>.from(res['reports'] ?? []);
  }
  Future<void> resolveReport(String id, {String status = 'resolved'}) async =>
      _api.post('/admin/reports/$id/resolve', data: {'status': status});
  Future<void> notify({required String title, required String body, String audience = 'all'}) async =>
      _api.post('/admin/notify', data: {'title': title, 'body': body, 'audience': audience});
}

/// Users API wrapper.
class UserService {
  UserService._();
  static final UserService instance = UserService._();
  final _api = ApiService.instance;

  Future<List<Map<String, dynamic>>> search(String q) async {
    final res = await _api.get('/users/search', query: {'q': q});
    return List<Map<String, dynamic>>.from(res['users'] ?? []);
  }
  Future<Map<String, dynamic>> updateMe(Map<String, dynamic> data) async => _api.put('/users/me', data: data);
  Future<void> block(String id) async => _api.post('/users/me/block/$id');
  Future<Map<String, dynamic>> requestDeletion() async => _api.post('/users/me/delete');
  Future<void> cancelDeletion() async => _api.post('/users/me/delete/cancel');
}

/// Luck box / red envelope API wrapper.
class LuckBoxService {
  LuckBoxService._();
  static final LuckBoxService instance = LuckBoxService._();
  final _api = ApiService.instance;

  Future<Map<String, dynamic>> send({required String roomId, required int totalCoins, int packets = 5, int ttlSec = 60}) async =>
      _api.post('/luckbox', data: {'roomId': roomId, 'totalCoins': totalCoins, 'packets': packets, 'ttlSec': ttlSec});
  Future<Map<String, dynamic>> claim(String id) async => _api.post('/luckbox/$id/claim');
}

/// PK battle API wrapper.
class PkService {
  PkService._();
  static final PkService instance = PkService._();
  final _api = ApiService.instance;

  Future<Map<String, dynamic>> start({required String roomId, required String hostBId, int durationSec = 300}) async =>
      _api.post('/pk/start', data: {'roomId': roomId, 'hostBId': hostBId, 'durationSec': durationSec});
  Future<Map<String, dynamic>> get(String id) async => _api.get('/pk/$id');
  Future<Map<String, dynamic>> support(String id, String side, int coins) async =>
      _api.post('/pk/$id/support', data: {'side': side, 'coins': coins});
  Future<Map<String, dynamic>> finish(String id) async => _api.post('/pk/$id/finish');
}
