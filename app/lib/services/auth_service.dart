import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/constants.dart';
import '../models/user.dart';
import 'api_service.dart';

/// Handles register / login / OTP / Google / guest / logout, persisting tokens.
class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  final _storage = const FlutterSecureStorage();
  final _api = ApiService.instance;

  User? currentUser;
  bool get isLoggedIn => currentUser != null;
  bool get isGuest => currentUser?.isGuest ?? false;

  Future<User> register({required String username, required String email, required String password}) async {
    final res = await _api.post('/auth/register', data: {'username': username, 'email': email, 'password': password});
    await _persist(res);
    return currentUser!;
  }

  Future<User> login({required String email, required String password}) async {
    final res = await _api.post('/auth/login', data: {'email': email, 'password': password});
    await _persist(res);
    return currentUser!;
  }

  /// Request an OTP for a phone number. Returns the dev code in non-prod.
  Future<String?> requestOtp(String phone) async {
    final res = await _api.post('/auth/otp/request', data: {'phone': phone});
    return res['devCode'] as String?;
  }

  Future<User> verifyOtp({required String phone, required String code, String? username}) async {
    final res = await _api.post('/auth/otp/verify', data: {'phone': phone, 'code': code, 'username': username});
    await _persist(res);
    return currentUser!;
  }

  Future<User> loginWithGoogle(String idToken) async {
    final res = await _api.post('/auth/google', data: {'idToken': idToken});
    await _persist(res);
    return currentUser!;
  }

  /// Guest login — limited permissions (no gifting, no room creation).
  Future<User> loginAsGuest() async {
    final res = await _api.post('/auth/guest');
    await _persist(res);
    return currentUser!;
  }

  Future<User?> restoreSession() async {
    final token = await _storage.read(key: AppConstants.kAccessToken);
    if (token == null) return null;
    try {
      final res = await _api.get('/auth/me');
      currentUser = User.fromJson(Map<String, dynamic>.from(res['user']));
      return currentUser;
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: AppConstants.kAccessToken);
    await _storage.delete(key: AppConstants.kRefreshToken);
    await _storage.delete(key: AppConstants.kUserId);
    currentUser = null;
  }

  Future<void> _persist(Map<String, dynamic> res) async {
    await _storage.write(key: AppConstants.kAccessToken, value: res['accessToken']);
    await _storage.write(key: AppConstants.kRefreshToken, value: res['refreshToken']);
    final user = User.fromJson(Map<String, dynamic>.from(res['user']));
    currentUser = user;
    await _storage.write(key: AppConstants.kUserId, value: user.id);
  }
}
