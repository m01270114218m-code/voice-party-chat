import 'package:flutter/material.dart';
import '../core/app_assets.dart';
import '../core/theme.dart';
import '../models/gift.dart';
import 'asset_button.dart';

/// Bottom-sheet gift picker. Returns the selected [Gift] via [onSend].
class GiftPanel extends StatefulWidget {
  final List<Gift> gifts;
  final int userCoins;
  final void Function(Gift gift, int quantity) onSend;

  const GiftPanel({
    super.key,
    required this.gifts,
    required this.userCoins,
    required this.onSend,
  });

  @override
  State<GiftPanel> createState() => _GiftPanelState();
}

class _GiftPanelState extends State<GiftPanel> {
  Gift? _selected;
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header: balance
          Row(
            children: [
              const Text('الهدايا',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const Spacer(),
              const AssetIcon(A.coinIcon, size: 20),
              const SizedBox(width: 4),
              Text('${widget.userCoins}',
                  style: const TextStyle(
                      color: AppTheme.gold, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          // Grid
          SizedBox(
            height: 240,
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: .8,
              ),
              itemCount: widget.gifts.length,
              itemBuilder: (_, i) {
                final g = widget.gifts[i];
                final selected = _selected?.id == g.id;
                return GestureDetector(
                  onTap: () => setState(() => _selected = g),
                  child: Container(
                    decoration: BoxDecoration(
                      color: selected
                          ? AppTheme.primary.withOpacity(.25)
                          : AppTheme.bg,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: selected ? AppTheme.primary : Colors.transparent,
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.asset(
                          A.giftCatalog[i % A.giftCatalog.length],
                          height: 44,
                          fit: BoxFit.contain,
                        ),
                        const SizedBox(height: 6),
                        Text(g.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 11)),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const AssetIcon(A.coinIcon, size: 12),
                            const SizedBox(width: 2),
                            Text('${g.price}',
                                style: const TextStyle(
                                    fontSize: 11, color: AppTheme.gold)),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          // Quantity + send
          Row(
            children: [
              _qtyButton(Icons.remove, () {
                if (_quantity > 1) setState(() => _quantity--);
              }),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Text('x$_quantity',
                    style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
              _qtyButton(Icons.add, () => setState(() => _quantity++)),
              const Spacer(),
              AssetButton(
                base: A.btnSendGift,
                width: 150,
                height: 50,
                onPressed: _selected == null
                    ? null
                    : () {
                        widget.onSend(_selected!, _quantity);
                        Navigator.pop(context);
                      },
                label: _selected == null
                    ? 'اختر هدية'
                    : 'إرسال (${_selected!.price * _quantity})',
                labelStyle: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 13),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _qtyButton(IconData icon, VoidCallback onTap) => InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: AppTheme.bg,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 18),
        ),
      );
}
