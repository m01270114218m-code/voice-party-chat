import 'api_service.dart';

/// Client-side moderation: profanity masking + PII redaction.
class ModerationService {
  ModerationService._();
  static final ModerationService instance = ModerationService._();
  final _api = ApiService.instance;

  static const List<String> _banned = [
    'كلب', 'حمار', 'غبي', 'قذر', 'خرا', 'زبالة', 'لعنة', 'تافه',
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'idiot', 'stupid',
  ];

  static final RegExp _phone = RegExp(r'(\+?\d[\d\s\-]{7,}\d)');
  static final RegExp _email = RegExp(r'[\w.+-]+@[\w-]+\.[\w.-]+');

  /// Mask banned words and PII locally (instant feedback).
  String mask(String text) {
    var out = text;
    for (final w in _banned) {
      out = out.replaceAll(RegExp(RegExp.escape(w), caseSensitive: false), '*' * w.length);
    }
    out = out.replaceAll(_phone, '********');
    out = out.replaceAll(_email, '********');
    return out;
  }

  /// Authoritative server-side classification.
  Future<Map<String, dynamic>> classify(String text) async {
    try {
      return await _api.post('/moderate', data: {'text': text});
    } catch (_) {
      return {'clean': mask(text), 'flags': <String>[], 'blocked': false};
    }
  }
}
