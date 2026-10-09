import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/room_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/wallet_screen.dart';
import '../screens/messages_screen.dart';
import '../screens/chat_screen.dart';
import '../screens/moments_screen.dart';
import '../screens/games_screen.dart';
import '../screens/reseller_screen.dart';
import '../screens/admin_dashboard_screen.dart';
import '../screens/support_screen.dart';
import '../screens/policies_screen.dart';
import '../screens/families_screen.dart';
import '../screens/pk_battle_screen.dart';
import '../screens/tool_store_screen.dart';
import '../screens/notifications_screen.dart';
import '../screens/search_screen.dart';
import '../models/room.dart';

/// Named routes for the whole app.
class AppRouter {
  AppRouter._();

  static const String splash = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String room = '/room';
  static const String profile = '/profile';
  static const String settings = '/settings';
  static const String wallet = '/wallet';
  static const String messages = '/messages';
  static const String chat = '/chat';
  static const String moments = '/moments';
  static const String games = '/games';
  static const String reseller = '/reseller';
  static const String admin = '/admin';
  static const String support = '/support';
  static const String policies = '/policies';
  static const String families = '/families';
  static const String pkBattle = '/pk';
  static const String toolStore = '/tool-store';
  static const String notifications = '/notifications';
  static const String search = '/search';

  static Route<dynamic> onGenerateRoute(RouteSettings s) {
    Widget page;
    switch (s.name) {
      case login: page = const LoginScreen(); break;
      case home: page = const HomeScreen(); break;
      case room:
        final roomId = (s.arguments as String?) ?? '';
        page = RoomScreen(room: Room(id: roomId, name: 'غرفة صوتية', ownerId: ''));
        break;
      case profile: page = const ProfileScreen(); break;
      case settings: page = const SettingsScreen(); break;
      case wallet: page = const WalletScreen(); break;
      case messages: page = const MessagesScreen(); break;
      case chat: page = ChatScreen(peer: s.arguments); break;
      case moments: page = const MomentsScreen(); break;
      case games: page = const GamesScreen(); break;
      case reseller: page = const ResellerScreen(); break;
      case admin: page = const AdminDashboardScreen(); break;
      case support: page = const SupportScreen(); break;
      case policies: page = const PoliciesScreen(); break;
      case families: page = const FamiliesScreen(); break;
      case pkBattle: page = PkBattleScreen(roomId: (s.arguments as String?) ?? ''); break;
      case toolStore: page = const ToolStoreScreen(); break;
      case notifications: page = const NotificationsScreen(); break;
      case search: page = const SearchScreen(); break;
      case splash:
      default: page = const SplashScreen();
    }
    return MaterialPageRoute(builder: (_) => page, settings: s);
  }
}
