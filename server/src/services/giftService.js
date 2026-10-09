const Gift = require('../models/Gift');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * Gift economy — atomic coin transfer from sender to receiver.
 * Receiver earns diamonds (1 diamond per 2 coins) and both sides get a
 * transaction record. Returns the gift + updated balances.
 */
async function sendGift({ senderId, receiverId, giftId, quantity = 1, roomId = null }) {
  const gift = await Gift.findById(giftId);
  if (!gift) throw Object.assign(new Error('gift_not_found'), { status: 404 });

  const cost = gift.price * quantity;
  const sender = await User.findById(senderId);
  if (!sender) throw Object.assign(new Error('sender_not_found'), { status: 404 });
  if (sender.coins < cost) throw Object.assign(new Error('insufficient_coins'), { status: 400 });

  sender.coins -= cost;
  sender.totalSpent += cost;
  sender.wealthLevel = Math.max(1, Math.floor(sender.totalSpent / 1000) + 1);
  await sender.save();

  const diamonds = Math.floor(cost / 2);
  if (receiverId && String(receiverId) !== String(senderId)) {
    const receiver = await User.findById(receiverId);
    if (receiver) {
      receiver.diamonds += diamonds;
      receiver.totalEarned += diamonds;
      receiver.talentLevel = Math.max(1, Math.floor(receiver.totalEarned / 500) + 1);
      await receiver.save();
    }
  }

  await Transaction.create({ userId: senderId, type: 'gift_sent', amount: cost, currency: 'coins', giftId, targetUserId: receiverId, roomId });
  if (receiverId) {
    await Transaction.create({ userId: receiverId, type: 'gift_received', amount: diamonds, currency: 'diamonds', giftId, targetUserId: senderId, roomId });
  }

  return { gift, cost, diamonds, senderCoins: sender.coins };
}

module.exports = { sendGift };
