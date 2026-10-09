import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Central design system — dark, premium, "night club" feel like Hago/Yalla.
class AppTheme {
  AppTheme._();

  // ── Palette (deliberate, 6 colors) ─────────────────────────────
  static const Color bg = Color(0xFF0B0B14);        // deep night
  static const Color surface = Color(0xFF16162A);   // cards
  static const Color surfaceAlt = Color(0xFF1F1F38);
  static const Color primary = Color(0xFF7C3AED);   // violet accent
  static const Color gold = Color(0xFFFFC542);      // VIP / coins
  static const Color pink = Color(0xFFFF4D8D);      // gifts / live
  static const Color cyan = Color(0xFF22D3EE);      // diamonds / info
  static const Color success = Color(0xFF22C55E);
  static const Color danger = Color(0xFFEF4444);
  static const Color textPrimary = Color(0xFFF5F5FA);
  static const Color textMuted = Color(0xFF9A9AB0);

  static ThemeData get dark {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: bg,
      colorScheme: base.colorScheme.copyWith(
        primary: primary,
        secondary: pink,
        surface: surface,
      ),
      textTheme: GoogleFonts.cairoTextTheme(base.textTheme).apply(
        bodyColor: textPrimary,
        displayColor: textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        hintStyle: const TextStyle(color: textMuted),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
    );
  }

  // ── Gradients ──────────────────────────────────────────────────
  static const LinearGradient liveGradient = LinearGradient(
    colors: [pink, primary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFFFD86F), Color(0xFFFFA000)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient diamondGradient = LinearGradient(
    colors: [Color(0xFF67E8F9), Color(0xFF0EA5E9)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient vipGradient = LinearGradient(
    colors: [Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFFB45309)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Reusable decorations ───────────────────────────────────────
  static BoxDecoration card({double radius = 18, Color? color}) => BoxDecoration(
        color: color ?? surface,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      );

  static BoxDecoration glow(Color c, {double radius = 20}) => BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [BoxShadow(color: c.withOpacity(0.45), blurRadius: 22, spreadRadius: 1)],
      );
}
