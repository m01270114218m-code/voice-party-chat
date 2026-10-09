import 'package:equatable/equatable.dart';

enum GiftRarity { common, rare, epic, legendary }

GiftRarity rarityFromString(String? v) => GiftRarity.values.firstWhere(
      (e) => e.name == v,
      orElse: () => GiftRarity.common,
    );

class Gift extends Equatable {
  final String id;
  final String name;
  final String icon;        // static preview image
  final String svgaFile;    // animated SVGA asset
  final String lottieFile;  // fallback Lottie JSON
  final int price;          // in coins
  final String category;
  final int animationDuration; // ms
  final GiftRarity rarity;
  final bool isFullscreen;

  const Gift({
    required this.id,
    required this.name,
    this.icon = '',
    this.svgaFile = '',
    this.lottieFile = '',
    required this.price,
    this.category = 'popular',
    this.animationDuration = 3000,
    this.rarity = GiftRarity.common,
    this.isFullscreen = false,
  });

  factory Gift.fromJson(Map<String, dynamic> j) => Gift(
        id: j['_id'] ?? j['id'] ?? '',
        name: j['name'] ?? '',
        icon: j['icon'] ?? '',
        svgaFile: j['svgaFile'] ?? '',
        lottieFile: j['lottieFile'] ?? '',
        price: j['price'] ?? 0,
        category: j['category'] ?? 'popular',
        animationDuration: j['animationDuration'] ?? 3000,
        rarity: rarityFromString(j['rarity']),
        isFullscreen: j['isFullscreen'] ?? false,
      );

  @override
  List<Object?> get props => [id, name, price, rarity];
}

/// A gift that was sent — used to trigger the SVGA animation for everyone.
class GiftEvent extends Equatable {
  final Gift gift;
  final String senderId;
  final String senderName;
  final String receiverId;
  final String receiverName;
  final int quantity;

  const GiftEvent({
    required this.gift,
    required this.senderId,
    required this.senderName,
    required this.receiverId,
    required this.receiverName,
    this.quantity = 1,
  });

  factory GiftEvent.fromJson(Map<String, dynamic> j) => GiftEvent(
        gift: Gift.fromJson(Map<String, dynamic>.from(j['gift'] ?? {})),
        senderId: j['senderId']?.toString() ?? '',
        senderName: j['senderName'] ?? '',
        receiverId: j['receiverId']?.toString() ?? '',
        receiverName: j['receiverName'] ?? '',
        quantity: j['quantity'] ?? 1,
      );

  @override
  List<Object?> get props => [gift, senderId, receiverId, quantity];
}
