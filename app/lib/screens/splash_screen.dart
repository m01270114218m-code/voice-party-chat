import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../services/auth_service.dart';
import 'home_screen.dart';
import 'login_screen.dart';

/// Restores the session, then routes to Home or Login.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    await Future.delayed(const Duration(milliseconds: 1400));
    final user = await AuthService.instance.restoreSession();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => user != null ? const HomeScreen() : const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage(A.bgLogin),
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(A.splashEmblem, height: 150, fit: BoxFit.contain),
              const SizedBox(height: 18),
              Image.asset(A.logo3d, height: 64, fit: BoxFit.contain),
              const SizedBox(height: 10),
              const Text('\u063a\u0631\u0641 \u0635\u0648\u062a\u064a\u0629 \u0645\u0628\u0627\u0634\u0631\u0629',
                  style: TextStyle(fontSize: 15, color: Colors.white70)),
              const SizedBox(height: 32),
              const CircularProgressIndicator(color: AppTheme.primary),
            ],
          ),
        ),
      ),
    );
  }
}
