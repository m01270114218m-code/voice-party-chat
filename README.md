# VoiceChat — Social Voice Chat App (v6)

A complete, production-oriented social voice-chat application in the style of
**Hago / Yalla / Ahla Chat / Makat**: live voice rooms, mic seats, gifts,
mini-games, PK battles, families, wallet, and a full admin dashboard.

> **v6 focus:** the entire asset library was **regenerated from scratch** —
> every asset is now produced **individually** (one image per asset, never a
> contact sheet that gets cropped), on a flat removable background, then
> chroma-keyed, trimmed and re-centred with **equal margins** on all four sides.

---

## 1. What's in this package

```
voicechat_v6/
├── app/                     Flutter application (Android-ready)
│   ├── lib/
│   │   ├── core/app_assets.dart      ← central asset registry (380 constants)
│   │   ├── screens/                  ← 21 screens
│   │   ├── widgets/                  ← AssetButton, MicSeat, GiftPanel, SvgaPlayer…
│   │   └── services/                 ← api, auth, socket, voice, wallet, translate…
│   ├── assets/                       ← the full asset library (mirrors /assets)
│   └── android/                      ← complete Android build config
├── server/                  Node.js + Express + Socket.io + MongoDB + Agora
├── assets/                  Master asset library (16 categories, 380 assets)
│   ├── assets_manifest.json          ← every asset: name, path, URL, usage
│   ├── SVGA_GUIDE.md                 ← how to export .svga from Adobe Animate
│   └── lottie/                       ← 6 ready-to-play Lottie animations
├── tools/                   Asset pipeline (spec → generate → process → QC)
├── docs/                    Architecture, API, deployment
├── coverage_report.json     required / found / missing / extra
└── README.md
```

---

## 2. The asset library (380 assets, 16 categories)

| Category | Count | Used for |
|----------|------:|----------|
| `brand` | 7 | Logo, app icon, splash emblem, coin/diamond, store icon, banner |
| `icons` | 48 | App-wide icon set (nav, headers, actions) |
| `buttons` | 138 | 46 buttons × 3 states (normal / pressed / disabled) |
| `backgrounds` | 10 | Home, login, 3 room stages, profile, wallet, leaderboard, neon, celebration |
| `rooms` | 19 | Mic seats (empty/busy/locked/muted), host frames, waveform, badges |
| `gifts` | 42 | Common / luxury / legendary gifts |
| `games` | 14 | Ludo, Domino, Uno, fortune wheel |
| `vip` | 11 | VIP vehicles, lion, peacock, dragon, entry effect |
| `frames` | 13 | Profile avatar frames (tool store) |
| `bubbles` | 6 | Chat message bubbles |
| `family` | 9 | Family/tribe crests and badges |
| `pk` | 11 | PK progress bars, win/lose, tomato, egg, splats |
| `luckbox` | 11 | Lucky box / red envelope |
| `ui` | 21 | Inputs, tabs, cards, toasts, status dots, switches, progress |
| `effects` | 12 | Full-screen gift/celebration effects |
| `avatars` | 8 | Default avatar gallery |

**Coverage:** `required 380 · found 380 · missing 0 · extra 0`
(see `coverage_report.json`).

### Style contract
Every asset follows one visual language: **glossy 3D / glassmorphism**, neon
**magenta–purple–cyan** palette with **gold accents**, single centred object,
generous even margins, transparent background.

### How the assets were produced
1. `tools/asset_spec.py` — the master spec: 380 assets with exact prompts + sizes.
2. `image_edit_or_generate` — **one call per asset** (no sheets).
3. `tools/process_asset.py` — chroma-key the flat magenta background → alpha,
   trim to content, re-centre with equal margins, resize to the category size.
4. `tools/qc_sheets.py` — one labelled contact sheet per category for visual QC.
5. `tools/build_manifest.py` — coverage report + `assets_manifest.json`.
6. `tools/gen_app_assets.py` — generates `app/lib/core/app_assets.dart`.

Re-run the whole pipeline:

```bash
python3 tools/asset_spec.py          # list the 380 required assets
python3 tools/build_manifest.py      # coverage + manifest
python3 tools/gen_app_assets.py      # regenerate the Dart registry
python3 tools/qc_sheets.py           # QC contact sheets
```

---

## 3. Animations (SVGA / Lottie)

Six **ready-to-play Lottie** animations ship in `assets/lottie/`:
`gift_burst`, `vip_entry`, `pk_win`, `pk_lose`, `luckbox_open`, `loading`.

`.svga` is a **binary** format and must be exported from a design tool — the
full production path (Adobe Animate → PNG sequence → `svga-converter`, or
Lottie → `lottie2svga`) is documented in **`assets/SVGA_GUIDE.md`**.

`lib/widgets/svga_player_widget.dart` resolves **SVGA → Lottie → nothing**, so
the app works today with Lottie and upgrading to SVGA is a pure asset drop-in
(no code change).

---

## 4. Running the app

### Backend
```bash
cd server
cp .env.example .env      # fill in Mongo URI, JWT secret, Agora keys
npm install
npm run seed              # demo data
npm run dev               # http://localhost:3000
```

### Flutter app
```bash
cd app
flutter pub get
flutter run               # or: flutter build apk --release
```

Demo account: `host@voicechat.dev` / `password123`

### Android build
- Package: `com.voicechat.app` · minSdk 23 · targetSdk 34
- Permissions: microphone, bluetooth, foreground service (background audio),
  notifications, billing, media — all declared in `AndroidManifest.xml`
- Launcher icons generated for all densities + adaptive icon
- Release signing: copy `android/key.properties.example` → `key.properties`

```bash
cd app
flutter build appbundle --release     # Play Store
flutter build apk --release           # direct APK
```

---

## 5. External services

| Service | Purpose | Alternatives |
|---------|---------|--------------|
| **Agora.io** | Live voice (RTC) | ZegoCloud, LiveKit |
| **MongoDB Atlas** | Database | PostgreSQL, Supabase |
| **Redis** | Presence / rate limiting | Upstash |
| **Stripe / Paymob** | Payments | Fawry, Tap, Google Play Billing |
| **S3 / Cloudflare R2** | Asset & media storage | Supabase Storage |
| **Firebase (FCM)** | Push notifications | OneSignal |
| **Google Translate API** | In-room translation | DeepL |

All providers sit behind thin service classes in `server/services/` and
`app/lib/services/`, so any of them can be swapped without touching the UI.

---

## 6. Notes

- The Flutter SDK is not installed in the build sandbox, so the app was verified
  by static analysis (import resolution, asset-registry cross-check) rather than
  a full `flutter build`. The backend is exercised by `server/scripts/smoke.js`.
- Publishing to Google Play / App Store requires your own developer accounts and
  signing keys (not part of the repository).
