# 🎙️ VoiceChat — تطبيق غرف دردشة صوتية (Architecture)

تطبيق غرف صوتية مباشرة شبيه بـ **Hago / Yalla / Ahla Chat / Makat**، جاهز للاستخدام (Production-ready) وليس نموذجاً تجريبياً.

---

## 1. نظرة عامة على المعمارية

```
┌──────────────────────────────────────────────────────────────────┐
│                        Flutter Mobile App                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │  Screens   │ │  Widgets   │ │  Services  │ │  State (BLoC)│  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
│         │              │              │                          │
│         └──────────────┴──────┬───────┘                          │
│                               │                                  │
│        ┌──────────────────────┼──────────────────────┐          │
│        │ REST (Dio)           │ WebSocket (Socket.io)│          │
│        │                      │                      │          │
│        │              ┌───────┴────────┐             │          │
│        │              │  Agora RTC SDK │ (Voice)     │          │
│        │              └───────┬────────┘             │          │
└────────┼──────────────────────┼──────────────────────┼──────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Node.js Backend (API + Realtime)              │
│  Express REST  │  Socket.io Gateway  │  Agora Token Service      │
│  Auth (JWT)    │  Room State Machine  │  Payment Webhooks         │
└───────┬────────────────┬───────────────────────┬─────────────────┘
        │                │                       │
        ▼                ▼                       ▼
   ┌─────────┐     ┌───────────┐          ┌──────────────┐
   │ MongoDB │     │  Redis    │          │  Agora Cloud │
   │ (data)  │     │ (presence)│          │  (voice RTC) │
   └─────────┘     └───────────┘          └──────────────┘
        │
        ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │  S3 / CDN    │   │  FCM Push    │   │  Stripe /    │
   │ (assets)     │   │ (notifs)     │   │  Paymob      │
   └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 2. التقنيات المستخدمة (Tech Stack)

| الطبقة | التقنية | السبب |
|--------|---------|-------|
| **الواجهة (Mobile)** | Flutter 3.x (Dart) | أداء أصلي، كود واحد لـ iOS/Android، دعم ممتاز للأنيميشن |
| **إدارة الحالة** | BLoC / Cubit | فصل منطق العمل عن الواجهة، قابلية الاختبار |
| **الصوت المباشر (RTC)** | **Agora Voice SDK** | الأفضل لغرف صوتية متعددة المتحدثين (8+ مايكات)، زمن تأخير < 200ms |
| **الوقت الحقيقي (Realtime)** | Socket.io | أحداث الغرفة (رفع يد، كتم، هدايا، شات) |
| **الباكند** | Node.js + Express | سريع، غير معطّل (non-blocking) مناسب للـ realtime |
| **قاعدة البيانات** | MongoDB + Mongoose | مرونة المخطط، مناسب لبيانات المستخدمين/الهدايا |
| **الكاش والحضور** | Redis | حالة الغرف الحية، عدّاد المستخدمين، rate limiting |
| **الأنيميشن** | **SVGA Player** | أنيميشن الهدايا والمؤثرات (خفيف، مدعوم من Flutter) |
| **الدفع** | Stripe + Paymob (الشرق الأوسط) | شحن العملات |
| **التخزين** | AWS S3 + CloudFront | صور الغرف، الأفاتارات، ملفات SVGA |
| **الإشعارات** | Firebase Cloud Messaging | Push notifications |

---

## 3. هيكل المشروع

```
voicechat/
├── app/                          # تطبيق Flutter
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── core/                 # الثيم، الثوابت، التوجيه
│       │   ├── theme.dart
│       │   ├── constants.dart
│       │   └── router.dart
│       ├── models/               # نماذج البيانات
│       │   ├── user.dart
│       │   ├── room.dart
│       │   ├── gift.dart
│       │   └── message.dart
│       ├── services/             # طبقة الخدمات
│       │   ├── api_service.dart      # REST (Dio)
│       │   ├── auth_service.dart     # تسجيل/دخول
│       │   ├── socket_service.dart   # Socket.io
│       │   ├── voice_service.dart    # Agora RTC
│       │   └── wallet_service.dart   # المحفظة والهدايا
│       ├── screens/              # الشاشات
│       │   ├── splash_screen.dart
│       │   ├── login_screen.dart
│       │   ├── home_screen.dart
│       │   ├── room_screen.dart
│       │   ├── profile_screen.dart
│       │   ├── wallet_screen.dart
│       │   └── settings_screen.dart
│       └── widgets/              # الودجات القابلة لإعادة الاستخدام
│           ├── mic_seat.dart
│           ├── room_card.dart
│           ├── gift_panel.dart
│           ├── room_chat.dart
│           ├── vip_badge.dart
│           └── svga_player_widget.dart
├── server/                       # الباكند Node.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js
│       ├── config/               # db, redis, env
│       ├── models/               # Mongoose schemas
│       ├── routes/               # auth, rooms, wallet, gifts
│       ├── sockets/              # room socket handlers
│       ├── services/             # agora, payment, gift
│       └── middleware/           # auth, error
├── assets/                       # الأصول
│   ├── rooms/                    # صور الغرف
│   ├── avatars/                  # الأفاتارات
│   ├── gifts/                    # صور الهدايا (3D)
│   └── svga/                     # ملفات أنيميشن SVGA
└── docs/
    ├── ARCHITECTURE.md           # هذا الملف
    ├── API.md                    # توثيق الـ API
    └── DEPLOYMENT.md             # النشر
```

---

## 4. نموذج البيانات (Data Model)

### User
```js
{
  _id, username, email, passwordHash, avatar, bio,
  level, xp, vipTier,          // 0=none,1=Silver,2=Gold,3=Diamond
  coins, diamonds,             // العملات (شحن) والماس (مكتسب من الهدايا)
  followers, following, badges: [],
  createdAt, lastSeen
}
```

### Room
```js
{
  _id, name, coverImage, category, ownerId,
  seats: [{ index, userId, isMuted, isLocked }],   // 8 مقاعد
  listeners: [userId],
  isLive, isPrivate, password,
  agoraChannel, totalGifts, createdAt
}
```

### Gift
```js
{
  _id, name, icon, svgaFile, price,       // السعر بالعملات
  category, animationDuration, rarity
}
```

### Transaction
```js
{
  _id, userId, type,     // 'recharge' | 'gift_sent' | 'gift_received'
  amount, currency, giftId, targetUserId,
  status, provider, providerRef, createdAt
}
```

---

## 5. تدفق الغرفة الصوتية (Voice Room Flow)

```
1. المستخدم يفتح الغرفة  →  POST /api/rooms/:id/join
2. الباكند يتحقق من الرصيد/الصلاحية  →  يولّد Agora RTC Token
3. العميل ينضم لقناة Agora  →  صوت مباشر
4. العميل يتصل بـ Socket.io room  →  أحداث حية
5. الأحداث:
   - seat:request      (رفع اليد)
   - seat:accept       (قبول → المستخدم يجلس على مايك)
   - seat:mute         (كتم/فتح)
   - seat:kick / ban   (طرد/حظر)
   - gift:send         (إرسال هدية → تشغيل SVGA للجميع)
   - chat:message      (شات نصي)
6. الخروج  →  POST /api/rooms/:id/leave  →  تحرير المقعد
```

---

## 6. الخدمات الخارجية المطلوبة (External Services)

| الخدمة | الغرض | البديل / الحل الجاهز |
|--------|-------|----------------------|
| **Agora.io** | الصوت المباشر (RTC) | بدائل: ZegoCloud، Twilio Voice، LiveKit (مفتوح المصدر) |
| **MongoDB Atlas** | قاعدة البيانات | بديل: PostgreSQL + Prisma، أو self-hosted |
| **Redis Cloud** | الحضور والكاش | بديل: Upstash Redis (serverless) |
| **AWS S3 / CloudFront** | تخزين الأصول | بديل: Cloudflare R2، Supabase Storage |
| **Stripe** | الدفع العالمي | — |
| **Paymob / Fawry** | الدفع في مصر/الشرق الأوسط | بديل: HyperPay، Tap Payments |
| **Firebase (FCM)** | الإشعارات | بديل: OneSignal |
| **Sentry** | تتبع الأخطاء | بديل: Bugsnag |

> **ملاحظة:** كل الخدمات لها طبقة تجريد (abstraction layer) في `server/src/services/`، فيمكن استبدال أي مزوّد دون تغيير منطق العمل.

---

## 7. الأمان

- **JWT** للجلسات (access + refresh tokens).
- **bcrypt** لتشفير كلمات المرور.
- **Rate limiting** على الـ API والـ Socket (Redis).
- **Input validation** عبر `express-validator` / `zod`.
- **Agora tokens** تُولّد على السيرفر فقط (لا تُكشف الـ App Certificate).
- **Payment webhooks** موقّعة ومتحققة.
- **HTTPS/WSS** إلزامي في الإنتاج.

---

## 8. قابلية التوسع (Scalability)

- **Socket.io Redis Adapter** لمزامنة الأحداث عبر عدة instances.
- **Horizontal scaling** للباكند خلف Load Balancer.
- **Agora** يتولى توزيع الصوت عالمياً (لا حمل على سيرفراتنا).
- **CDN** للأصول الثابتة.
- **MongoDB sharding** عند نمو البيانات.
