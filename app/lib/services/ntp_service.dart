import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/constants.dart';
import 'api_service.dart';

/// NTP-style clock sync.
/// The server is the single time authority — gift-box countdowns, PK timers
/// and luck envelopes all use `now()` so a tampered device clock cannot cheat.
class NtpService {
  NtpService._();
  static final NtpService instance = NtpService._();

  final _storage = const FlutterSecureStorage();
  int _offsetMs = 0;

  /// Fetch server time and compute the local offset.
  Future<void> sync() async {
    try {
      final t0 = DateTime.now().millisecondsSinceEpoch;
      final res = await ApiService.instance.get('/time');
      final t1 = DateTime.now().millisecondsSinceEpoch;
      final serverNow = (res['now'] as num).toInt();
      final rtt = t1 - t0;
      _offsetMs = serverNow + (rtt ~/ 2) - t1;
      await _storage.write(key: AppConstants.kServerTimeOffset, value: '$_offsetMs');
    } catch (_) {
      final cached = await _storage.read(key: AppConstants.kServerTimeOffset);
      if (cached != null) _offsetMs = int.tryParse(cached) ?? 0;
    }
  }

  /// Server-synced current time.
  DateTime now() => DateTime.now().add(Duration(milliseconds: _offsetMs));

  int get offsetMs => _offsetMs;
}
