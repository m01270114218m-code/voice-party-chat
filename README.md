# Voice Party Chat

A real-time voice party chat app inspired by social room apps like Hago.

## Features
- Live voice rooms
- Create and join rooms
- Mute/unmute controls
- In-room text chat
- Room host moderation
- User avatars and profiles
- Dark premium UI
- Responsive layout

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express + Socket.IO
- Realtime audio: WebRTC
- Database: PostgreSQL + Prisma
- Auth: Firebase or Supabase-ready
- Icons: Lucide React

## Project Structure

```bash
voice-party-chat/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json
└── .npmrc
```

## Quick Start

```bash
npm install

# frontend
cd client && npm install && npm run dev

# backend
cd ../server && npm install && npm run dev
```

## Notes
This project is structured as a modern starter for a social voice room app and can be extended with avatars, live moderation, gifting, and room themes.
