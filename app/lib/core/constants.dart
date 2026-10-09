/// App-wide constants: API endpoints, socket events, room config.
class AppConstants {
  AppConstants._();

  // ── Backend ────────────────────────────────────────────────────
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:4000/api',
  );
  static const String socketUrl = String.fromEnvironment(
    'SOCKET_URL',
    defaultValue: 'http://10.0.2.2:4000',
  );

  // ── Room config ────────────────────────────────────────────────
  static const int maxMicSeats = 10;
  static const int maxListeners = 500;
  static const int familyCreationCost = 5000;
  static const int minWithdrawalDiamonds = 1000;
  static const int accountDeletionGraceDays = 14;

  // ── VIP tiers ──────────────────────────────────────────────────
  static const List<String> vipTiers = ['None', 'Silver', 'Gold', 'Diamond'];

  // ── Storage keys ───────────────────────────────────────────────
  static const String kAccessToken = 'access_token';
  static const String kRefreshToken = 'refresh_token';
  static const String kUserId = 'user_id';
  static const String kServerTimeOffset = 'server_time_offset';
}

/// Socket.io event names — must match the backend exactly.
class SocketEvents {
  SocketEvents._();

  // Room lifecycle
  static const String joinRoom = 'room:join';
  static const String leaveRoom = 'room:leave';
  static const String roomState = 'room:state';
  static const String userJoined = 'room:user_joined';
  static const String userLeft = 'room:user_left';

  // Seats
  static const String seatRequest = 'seat:request';
  static const String seatAccept = 'seat:accept';
  static const String seatReject = 'seat:reject';
  static const String seatLeave = 'seat:leave';
  static const String seatMute = 'seat:mute';
  static const String seatKick = 'seat:kick';
  static const String seatBan = 'seat:ban';
  static const String seatLock = 'seat:lock';

  // Gifts & chat
  static const String giftSend = 'gift:send';
  static const String giftReceived = 'gift:received';
  static const String giftError = 'gift:error';
  static const String chatMessage = 'chat:message';
  static const String chatHistory = 'chat:history';
  static const String chatBlocked = 'chat:blocked';
  static const String walletUpdate = 'wallet:update';

  // Moderation
  static const String muteAll = 'mod:mute_all';

  // PK battles
  static const String pkStart = 'pk:start';
  static const String pkSupport = 'pk:support';
  static const String pkUpdate = 'pk:update';

  // Luck box
  static const String luckboxSend = 'luckbox:send';
  static const String luckboxNew = 'luckbox:new';

  // Voice effects
  static const String voiceEffect = 'voice:effect';
}

/// Room categories shown as tabs on the home screen.
class RoomCategories {
  RoomCategories._();
  static const List<Map<String, String>> tabs = [
    {'key': 'all', 'label': 'الكل'},
    {'key': 'games', 'label': 'ألعاب'},
    {'key': 'music', 'label': 'موسيقى'},
    {'key': 'chat', 'label': 'دردشة'},
    {'key': 'country', 'label': 'غرف دولتي'},
    {'key': 'vip', 'label': 'VIP'},
  ];
}

/// Country dialing codes for the phone-login picker.
class CountryCodes {
  CountryCodes._();
  static const List<Map<String, String>> list = [
    {'name': 'مصر', 'flag': '🇪🇬', 'code': '+20'},
    {'name': 'السعودية', 'flag': '🇸🇦', 'code': '+966'},
    {'name': 'الإمارات', 'flag': '🇦🇪', 'code': '+971'},
    {'name': 'الكويت', 'flag': '🇰🇼', 'code': '+965'},
    {'name': 'قطر', 'flag': '🇶🇦', 'code': '+974'},
    {'name': 'العراق', 'flag': '🇮🇶', 'code': '+964'},
    {'name': 'الأردن', 'flag': '🇯🇴', 'code': '+962'},
    {'name': 'المغرب', 'flag': '🇲🇦', 'code': '+212'},
    {'name': 'الجزائر', 'flag': '🇩🇿', 'code': '+213'},
    {'name': 'تونس', 'flag': '🇹🇳', 'code': '+216'},
    {'name': 'لبنان', 'flag': '🇱🇧', 'code': '+961'},
    {'name': 'تركيا', 'flag': '🇹🇷', 'code': '+90'},
    {'name': 'الولايات المتحدة', 'flag': '🇺🇸', 'code': '+1'},
    {'name': 'المملكة المتحدة', 'flag': '🇬🇧', 'code': '+44'},
  ];
}
