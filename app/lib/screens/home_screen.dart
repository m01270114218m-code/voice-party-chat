import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../widgets/asset_button.dart';
import '../models/room.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../widgets/room_card.dart';
import 'profile_screen.dart';
import 'room_screen.dart';
import 'wallet_screen.dart';

/// Home: live rooms grid + categories + bottom nav.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;
  bool _loading = true;
  List<Room> _rooms = [];
  String _category = 'الكل';
  final _categories = ['الكل', 'دردشة', 'موسيقى', 'ألعاب', 'دعم'];

  @override
  void initState() {
    super.initState();
    _loadRooms();
  }

  Future<void> _loadRooms() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.instance.get('/rooms', query: {
        if (_category != 'الكل') 'category': _category,
      });
      final list = (res['rooms'] as List? ?? []);
      _rooms = list
          .map((e) => Room.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    } catch (_) {
      _rooms = [];
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage(A.bgHome),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: IndexedStack(
            index: _tab,
            children: [
              _buildHome(),
              const ProfileScreen(),
              const WalletScreen(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: AppTheme.surface,
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(
              icon: AssetIcon(A.home, size: 24),
              selectedIcon: AssetIcon(A.home, size: 26),
              label: 'الرئيسية'),
          NavigationDestination(
              icon: AssetIcon(A.profile, size: 24),
              selectedIcon: AssetIcon(A.profile, size: 26),
              label: 'بروفايلي'),
          NavigationDestination(
              icon: AssetIcon(A.wallet, size: 24),
              selectedIcon: AssetIcon(A.wallet, size: 26),
              label: 'المحفظة'),
        ],
      ),
    );
  }

  Widget _buildHome() {
    final user = AuthService.instance.currentUser;
    return RefreshIndicator(
      onRefresh: _loadRooms,
      child: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  const Text('الغرف الصوتية',
                      style: TextStyle(
                          fontSize: 24, fontWeight: FontWeight.bold)),
                  const Spacer(),
                  const AssetIconButton(
                      asset: A.search, onPressed: null, size: 40, iconSize: 22),
                  const SizedBox(width: 6),
                  const AssetIconButton(
                      asset: A.bell, onPressed: null, size: 40, iconSize: 22),
                  const SizedBox(width: 6),
                  if (user != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          const AssetIcon(A.coinIcon, size: 18),
                          const SizedBox(width: 4),
                          Text('${user.coins}',
                              style: const TextStyle(
                                  color: AppTheme.gold,
                                  fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Categories
          SliverToBoxAdapter(
            child: SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) {
                  final c = _categories[i];
                  final active = c == _category;
                  return GestureDetector(
                    onTap: () {
                      setState(() => _category = c);
                      _loadRooms();
                    },
                    child: Container(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                      decoration: BoxDecoration(
                        gradient: active ? AppTheme.liveGradient : null,
                        color: active ? null : AppTheme.surface,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(c,
                          style: TextStyle(
                              color: active
                                  ? Colors.white
                                  : AppTheme.textMuted,
                              fontWeight: FontWeight.w600)),
                    ),
                  );
                },
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 12)),
          // Grid
          if (_loading)
            const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_rooms.isEmpty)
            const SliverFillRemaining(
              child: Center(
                child: Text('لا توجد غرف حالياً',
                    style: TextStyle(color: AppTheme.textMuted)),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: .82,
                ),
                delegate: SliverChildBuilderDelegate(
                  (_, i) => RoomCard(
                    room: _rooms[i],
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => RoomScreen(room: _rooms[i]),
                      ),
                    ),
                  ),
                  childCount: _rooms.length,
                ),
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 20)),
        ],
      ),
    );
  }
}
