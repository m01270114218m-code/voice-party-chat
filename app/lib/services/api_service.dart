import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/constants.dart';

/// Low-level REST client. Handles auth headers, refresh, and error mapping.
class ApiService {
  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 20),
      headers: {'Content-Type': 'application/json'},
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: AppConstants.kAccessToken);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (e, handler) async {
        // Auto-refresh on 401 once.
        if (e.response?.statusCode == 401 &&
            e.requestOptions.extra['retried'] != true) {
          final ok = await _refreshToken();
          if (ok) {
            final req = e.requestOptions;
            req.extra['retried'] = true;
            try {
              final res = await _dio.fetch(req);
              return handler.resolve(res);
            } catch (_) {}
          }
        }
        handler.next(e);
      },
    ));
  }

  static final ApiService instance = ApiService._internal();
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  Dio get dio => _dio;

  Future<bool> _refreshToken() async {
    try {
      final refresh = await _storage.read(key: AppConstants.kRefreshToken);
      if (refresh == null) return false;
      final res = await Dio().post(
        '${AppConstants.apiBaseUrl}/auth/refresh',
        data: {'refreshToken': refresh},
      );
      final token = res.data['accessToken'];
      if (token != null) {
        await _storage.write(key: AppConstants.kAccessToken, value: token);
        return true;
      }
    } catch (_) {}
    return false;
  }

  // ── Generic helpers ────────────────────────────────────────
  Future<Map<String, dynamic>> get(String path,
      {Map<String, dynamic>? query}) async {
    final res = await _dio.get(path, queryParameters: query);
    return Map<String, dynamic>.from(res.data);
  }

  Future<Map<String, dynamic>> post(String path,
      {Map<String, dynamic>? data}) async {
    final res = await _dio.post(path, data: data);
    return Map<String, dynamic>.from(res.data);
  }

  Future<Map<String, dynamic>> put(String path,
      {Map<String, dynamic>? data}) async {
    final res = await _dio.put(path, data: data);
    return Map<String, dynamic>.from(res.data);
  }

  Future<Map<String, dynamic>> delete(String path) async {
    final res = await _dio.delete(path);
    return Map<String, dynamic>.from(res.data);
  }
}
