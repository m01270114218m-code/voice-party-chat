import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../services/auth_service.dart';
import '../widgets/asset_button.dart';
import 'home_screen.dart';

/// Login / Register screen with a toggle.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLogin = true;
  bool _loading = false;
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _username = TextEditingController();

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      if (_isLogin) {
        await AuthService.instance
            .login(email: _email.text.trim(), password: _password.text);
      } else {
        await AuthService.instance.register(
          username: _username.text.trim(),
          email: _email.text.trim(),
          password: _password.text,
        );
      }
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('\u062e\u0637\u0623: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _enterAsGuest() {
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
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),
                Image.asset(A.logo3d, height: 110, fit: BoxFit.contain),
                const SizedBox(height: 12),
                Text(
                  _isLogin ? '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644' : '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      fontSize: 26, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 28),
                if (!_isLogin) ...[
                  TextField(
                    controller: _username,
                    decoration: const InputDecoration(
                      hintText: '\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645',
                      prefixIcon: AssetIcon(A.profile, size: 20),
                    ),
                  ),
                  const SizedBox(height: 14),
                ],
                TextField(
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
                    prefixIcon: AssetIcon(A.chat, size: 20),
                  ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _password,
                  obscureText: true,
                  decoration: const InputDecoration(
                    hintText: '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
                    prefixIcon: AssetIcon(A.lock, size: 20),
                  ),
                ),
                const SizedBox(height: 24),
                AssetButton(
                  base: A.btnLogin,
                  height: 56,
                  onPressed: _loading ? null : _submit,
                  label: _isLogin ? '\u062f\u062e\u0648\u0644' : '\u062a\u0633\u062c\u064a\u0644',
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: AssetButton(
                        base: A.btnGoogle,
                        height: 50,
                        onPressed: _loading ? null : () {},
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: AssetButton(
                        base: A.btnPhone,
                        height: 50,
                        onPressed: _loading ? null : () {},
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                AssetButton(
                  base: A.btnGuest,
                  height: 50,
                  onPressed: _loading ? null : _enterAsGuest,
                ),
                const SizedBox(height: 16),
                TextButton(
                  onPressed: () => setState(() => _isLogin = !_isLogin),
                  child: Text(
                    _isLogin
                        ? '\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f \u0633\u062c\u0651\u0644 \u0627\u0644\u0622\u0646'
                        : '\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f \u0633\u062c\u0651\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
                    style: const TextStyle(color: AppTheme.textMuted),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
