import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import 'home_screen.dart';

/// Opens the app directly in guest/demo mode without requiring login.
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
    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
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
              const Text('غرف صوتية مباشرة',
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
