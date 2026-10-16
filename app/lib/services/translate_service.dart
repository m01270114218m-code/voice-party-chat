import 'api_service.dart';

/// Instant translation of in-room chat messages (Google Translate via backend).
class TranslateService {
  TranslateService._();
  static final TranslateService instance = TranslateService._();
  final _api = ApiService.instance;

  final Map<String, String> _cache = {};

  Future<String> translate(String text, {String target = 'en', String source = 'auto'}) async {
    final key = '$target|$text';
    if (_cache.containsKey(key)) return _cache[key]!;
    try {
      final res = await _api.post('/translate', data: {'text': text, 'target': target, 'source': source});
      final out = res['translated'] as String? ?? text;
      _cache[key] = out;
      return out;
    } catch (_) {
      return text;
    }
  }
}
