import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:svgaplayer_flutter/svgaplayer_flutter.dart';

import '../core/app_assets.dart';

/// Plays a full-screen gift / room effect.
///
/// Resolution order (never breaks the UI):
///   1. SVGA from [assetUrl] (remote or bundled .svga)
///   2. bundled Lottie fallback ([lottieFallback], default gift burst)
///   3. nothing (fires onComplete immediately)
class SvgaPlayerWidget extends StatefulWidget {
  final String assetUrl;
  final String lottieFallback;
  final VoidCallback? onComplete;

  const SvgaPlayerWidget({
    super.key,
    required this.assetUrl,
    this.lottieFallback = A.lottieGiftBurst,
    this.onComplete,
  });

  @override
  State<SvgaPlayerWidget> createState() => _SvgaPlayerWidgetState();
}

class _SvgaPlayerWidgetState extends State<SvgaPlayerWidget>
    with TickerProviderStateMixin {
  SVGAAnimationController? _svga;
  bool _useLottie = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (widget.assetUrl.isEmpty || !widget.assetUrl.endsWith('.svga')) {
      _fallback();
      return;
    }
    try {
      _svga = SVGAAnimationController(vsync: this);
      final item = await SVGAParser.shared.decodeFromURL(widget.assetUrl);
      _svga!.videoItem = item;
      await _svga!.forward().orCancel;
      widget.onComplete?.call();
    } catch (_) {
      _fallback();
    }
  }

  void _fallback() {
    if (mounted) {
      setState(() => _useLottie = true);
    } else {
      widget.onComplete?.call();
    }
  }

  @override
  void dispose() {
    _svga?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Center(
        child: _useLottie
            ? Lottie.asset(
                widget.lottieFallback,
                fit: BoxFit.contain,
                repeat: false,
                onLoaded: (_) {},
                errorBuilder: (_, __, ___) {
                  widget.onComplete?.call();
                  return const SizedBox.shrink();
                },
              )
            : (_svga != null
                ? SVGAImage(_svga!, fit: BoxFit.contain)
                : const SizedBox.shrink()),
      ),
    );
  }
}

/// Helper to show an SVGA (or Lottie-fallback) animation as a transient overlay.
class SvgaOverlay {
  static void show(BuildContext context, String assetUrl,
      {String lottieFallback = A.lottieGiftBurst}) {
    late OverlayEntry entry;
    entry = OverlayEntry(
      builder: (_) => SvgaPlayerWidget(
        assetUrl: assetUrl,
        lottieFallback: lottieFallback,
        onComplete: () => entry.remove(),
      ),
    );
    Overlay.of(context).insert(entry);
  }
}
