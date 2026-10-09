import 'package:flutter/material.dart';
import '../core/app_assets.dart';

/// A button rendered from three PNG assets (normal / pressed / disabled).
///
/// [base] is the asset path WITHOUT the state suffix, e.g.
/// `assets/buttons/btn_login`. The widget swaps the image on press and when
/// disabled, so every button in the app uses its own artwork.
class AssetButton extends StatefulWidget {
  final String base;
  final VoidCallback? onPressed;
  final double? width;
  final double height;
  final String? label;
  final TextStyle? labelStyle;
  final EdgeInsets labelPadding;

  const AssetButton({
    super.key,
    required this.base,
    required this.onPressed,
    this.width,
    this.height = 52,
    this.label,
    this.labelStyle,
    this.labelPadding = const EdgeInsets.symmetric(horizontal: 18),
  });

  @override
  State<AssetButton> createState() => _AssetButtonState();
}

class _AssetButtonState extends State<AssetButton> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final disabled = widget.onPressed == null;
    final state = disabled
        ? A.stateDisabled
        : (_down ? A.statePressed : A.stateNormal);
    final img = Image.asset(
      A.btnState(widget.base, state),
      height: widget.height,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
    );

    return GestureDetector(
      onTapDown: disabled ? null : (_) => setState(() => _down = true),
      onTapUp: disabled ? null : (_) => setState(() => _down = false),
      onTapCancel: disabled ? null : () => setState(() => _down = false),
      onTap: widget.onPressed,
      child: SizedBox(
        width: widget.width,
        height: widget.height,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Positioned.fill(child: img),
            if (widget.label != null)
              Padding(
                padding: widget.labelPadding,
                child: Text(
                  widget.label!,
                  textAlign: TextAlign.center,
                  style: widget.labelStyle ??
                      const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// A circular icon button backed by a single PNG asset (e.g. room action bar).
class AssetIconButton extends StatelessWidget {
  final String asset;
  final VoidCallback? onPressed;
  final double size;
  final double iconSize;
  final Color? glow;

  const AssetIconButton({
    super.key,
    required this.asset,
    required this.onPressed,
    this.size = 50,
    this.iconSize = 26,
    this.glow,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          boxShadow: glow == null
              ? null
              : [BoxShadow(color: glow!.withOpacity(.5), blurRadius: 16)],
        ),
        child: Opacity(
          opacity: onPressed == null ? .45 : 1,
          child: Image.asset(asset, width: iconSize, height: iconSize,
              fit: BoxFit.contain, filterQuality: FilterQuality.high),
        ),
      ),
    );
  }
}

/// A plain asset icon (no background) for headers, lists and tabs.
class AssetIcon extends StatelessWidget {
  final String asset;
  final double size;
  final Color? color;

  const AssetIcon(this.asset, {super.key, this.size = 24, this.color});

  @override
  Widget build(BuildContext context) {
    final img = Image.asset(asset, width: size, height: size,
        fit: BoxFit.contain, filterQuality: FilterQuality.high);
    if (color == null) return img;
    return ColorFiltered(
      colorFilter: ColorFilter.mode(color!, BlendMode.srcIn),
      child: img,
    );
  }
}
