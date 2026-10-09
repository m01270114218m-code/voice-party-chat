import '../models/gift.dart';
import '../models/family.dart';
import 'api_service.dart';

/// Wallet + gift economy: balance, recharge, gift catalog, sending gifts,
/// diamond conversion and withdrawals.
class WalletService {
  WalletService._();
  static final WalletService instance = WalletService._();

  final _api = ApiService.instance;

  Future<Map<String, dynamic>> getBalance() async => _api.get('/wallet/balance');

  Future<List<RechargePackage>> getPackages() async {
    final res = await _api.get('/wallet/packages');
    return (res['packages'] as List? ?? [])
        .map((e) => RechargePackage.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  Future<Map<String, dynamic>> createRecharge({required String packageId, String provider = 'stripe'}) async =>
      _api.post('/wallet/recharge', data: {'packageId': packageId, 'provider': provider});

  Future<Map<String, dynamic>> convertDiamonds(int diamonds) async =>
      _api.post('/wallet/convert', data: {'diamonds': diamonds});

  Future<Map<String, dynamic>> requestWithdrawal({required int diamonds, String method = 'bank', String accountInfo = ''}) async =>
      _api.post('/wallet/withdraw', data: {'diamonds': diamonds, 'method': method, 'accountInfo': accountInfo});

  Future<List<Gift>> getGiftCatalog() async {
    final res = await _api.get('/gifts');
    return (res['gifts'] as List? ?? [])
        .map((e) => Gift.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  Future<Map<String, dynamic>> sendGift({required String roomId, required String giftId, required String receiverId, int quantity = 1}) async =>
      _api.post('/gifts/send', data: {'roomId': roomId, 'giftId': giftId, 'receiverId': receiverId, 'quantity': quantity});

  Future<List<Map<String, dynamic>>> getTransactions() async {
    final res = await _api.get('/wallet/transactions');
    return List<Map<String, dynamic>>.from(res['transactions'] ?? []);
  }
}
