import 'package:flutter_test/flutter_test.dart';
import 'package:voicechat/core/router.dart';
import 'package:flutter/material.dart';

void main() {
  group('AppRouter', () {
    test('generates a route for the splash screen', () {
      final route = AppRouter.onGenerateRoute(
        const RouteSettings(name: AppRouter.splash),
      );
      expect(route, isNotNull);
    });

    test('generates a route for login', () {
      final route = AppRouter.onGenerateRoute(
        const RouteSettings(name: AppRouter.login),
      );
      expect(route, isNotNull);
    });

    test('generates a route for home', () {
      final route = AppRouter.onGenerateRoute(
        const RouteSettings(name: AppRouter.home),
      );
      expect(route, isNotNull);
    });
  });
}
