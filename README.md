# ActionBook

A Google Keep-inspired note-taking app with colorful cards, pin/archive support, search, and dark/light mode. Built with React Native (Expo) on mobile and a Node.js + Express REST API backed by MongoDB.

## Features

- Create, edit, and delete notes with a title and body
- Color-code notes with 8 accent colors
- Pin important notes to the top of the list
- Archive notes to move them out of the main list without deleting them
- Search notes by title or body
- Dark and light mode, persisted on the device with AsyncStorage
- Clean card-based layout with bottom-tab navigation (Home / Archive)

## Tech Stack

| Layer      | Technology                                             |
|------------|--------------------------------------------------------|
| Mobile     | React Native 0.81, Expo SDK 54, React 19, TypeScript   |
| UI         | React Native Paper 5 (Material Design 3)               |
| Navigation | React Navigation 6 (stack + bottom tabs)               |
| HTTP       | Axios                                                  |
| Backend    | Node.js, Express 4, TypeScript                         |
| Database   | MongoDB (Atlas or local) via Mongoose 8                |
| Security   | Helmet, CORS                                           |

## Project Structure

```
ActionBook/
├── backend/                  # Express REST API (default port 5000)
│   ├── .env.example
│   └── src/
│       ├── app.ts            # Server entry, Mongo connection
│       ├── models/           # Note schema (Mongoose)
│       ├── controllers/      # noteController.ts
│       ├── routes/           # notes.ts
│       └── middleware/       # errorHandler.ts
└── mobile/                   # Expo React Native app
    ├── App.tsx               # Theme provider + persistence
    └── src/
        ├── screens/          # HomeScreen, ArchiveScreen, EditNoteScreen
        ├── components/       # NoteCard, ColorPicker, EmptyState
        ├── navigation/       # AppNavigator (stack + tabs)
        ├── hooks/            # useTheme
        ├── theme/            # light/dark Paper themes
        ├── types/            # Shared TypeScript types
        └── api/              # notesApi.ts (Axios client)
```

---

## Setup Guide

### 1. Prerequisites

Install these before you start:

| Tool          | Version | Notes                                                        |
|---------------|---------|--------------------------------------------------------------|
| Node.js       | 18+     | `node -v` to check. Ships with npm.                          |
| Git           | any     | To clone the repo.                                           |
| MongoDB       | —       | A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or MongoDB running locally. |
| Expo Go       | latest  | Install on your phone from the App Store / Play Store, if you want to run on a physical device. |
| Android Studio / Xcode | — | Only needed if you prefer an emulator/simulator over a physical device. |

You do **not** need to install the Expo CLI globally — the project uses `npx expo`, which comes with the local `expo` dependency.

### 2. Clone the repository

```bash
git clone https://github.com/Vishvajitjadhav/ActionBook_MobileApp.git
cd ActionBook_MobileApp
```

### 3. Set up MongoDB

**Option A — MongoDB Atlas (recommended)**

1. Create a free account and a free (M0) cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user and note the username/password.
3. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development only).
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Append the database name `actionbook` to the end of the path.

**Option B — Local MongoDB**

Install MongoDB Community Server and use:
```
mongodb://127.0.0.1:27017/actionbook
```

### 4. Configure and run the backend

```bash
cd backend
npm install
```

Create the `.env` file from the template:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Then edit `backend/.env` with your values:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/actionbook
PORT=5000
```

> If your password contains special characters (`@`, `:`, `/`, `#`), URL-encode them — e.g. `@` becomes `%40`.

Start the dev server (hot reload via `ts-node-dev`):

```bash
npm run dev
```

You should see:

```
MongoDB connected
Server running on port 5000
```

Verify the API is up:

```bash
curl http://localhost:5000/api/notes
# → []
```

### 5. Point the mobile app at your backend

The mobile app cannot reach `localhost` — on a phone or emulator, `localhost` means the device itself, not your computer. Open `mobile/src/api/notesApi.ts` and set `BASE_URL` for your setup:

| Running on           | BASE_URL                              |
|----------------------|---------------------------------------|
| Physical device (Expo Go) | `http://<your-computer-LAN-IP>:5000/api` |
| Android emulator     | `http://10.0.2.2:5000/api`            |
| iOS simulator        | `http://localhost:5000/api`           |

Find your computer's LAN IP:

```bash
# Windows
ipconfig          # look for "IPv4 Address" (e.g. 192.168.1.105)

# macOS
ipconfig getifaddr en0

# Linux
hostname -I
```

```ts
// mobile/src/api/notesApi.ts
const BASE_URL = 'http://192.168.1.105:5000/api';
```

> Your phone and computer must be on the **same Wi-Fi network**. On Windows, you may also need to allow Node.js through the firewall on private networks the first time.

### 6. Run the mobile app

```bash
cd ../mobile
npm install
npx expo start
```

Then choose how to open it:

- **Physical device** — scan the QR code in the terminal with Expo Go (Android) or the Camera app (iOS).
- **Android emulator** — press `a` in the terminal.
- **iOS simulator** — press `i` (macOS only).

Keep the backend running in a separate terminal while the app is open.

### 7. Verify everything works

1. Tap the **+** button and create a note — it should persist after you reload the app (`r` in the Expo terminal).
2. Pin a note and confirm it jumps to the top.
3. Archive a note and confirm it appears on the **Archive** tab.
4. Toggle dark mode, fully close the app, reopen it — the theme should be remembered.

---

## API Reference

Base URL: `http://<host>:5000/api`

| Method | Endpoint              | Description                                        |
|--------|-----------------------|----------------------------------------------------|
| GET    | `/notes`              | List unarchived notes (pinned first, then newest). Optional `?search=` filters title and body. |
| GET    | `/notes/archive`      | List archived notes                                |
| GET    | `/notes/:id`          | Get a single note                                  |
| POST   | `/notes`              | Create a note                                      |
| PUT    | `/notes/:id`          | Update a note                                      |
| DELETE | `/notes/:id`          | Delete a note                                      |

### Note object

```json
{
  "_id": "6650f1c2e4b0a1d2c3e4f5a6",
  "title": "Groceries",
  "body": "Milk, eggs, coffee",
  "color": "teal",
  "isPinned": false,
  "isArchived": false,
  "createdAt": "2026-01-14T10:22:31.004Z",
  "updatedAt": "2026-01-14T10:22:31.004Z"
}
```

`color` must be one of: `default`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `purple`.

### Example

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","body":"Milk, eggs, coffee","color":"teal"}'
```

## Environment Variables

`backend/.env`:

| Variable      | Required | Default | Description                          |
|---------------|----------|---------|--------------------------------------|
| `MONGODB_URI` | yes      | —       | MongoDB connection string. The server exits if this is missing. |
| `PORT`        | no       | `5000`  | Port the API listens on.             |

## Available Scripts

**backend**

| Command         | Description                                  |
|-----------------|----------------------------------------------|
| `npm run dev`   | Start with hot reload (`ts-node-dev`)        |
| `npm run build` | Compile TypeScript to `dist/`                |
| `npm start`     | Run the compiled build (`node dist/app.js`)  |

**mobile**

| Command           | Description                       |
|-------------------|-----------------------------------|
| `npm start`       | Start the Expo dev server         |
| `npm run android` | Start and open on Android         |
| `npm run ios`     | Start and open on iOS (macOS)     |

## Troubleshooting

**`MONGODB_URI is not set in .env`**
The `.env` file is missing or in the wrong folder. It must be at `backend/.env`, not the repo root.

**Backend can't resolve the Atlas hostname / `querySrv ENOTFOUND`**
`backend/src/app.ts` already works around this: when the URI starts with `mongodb+srv://`, it resolves the SRV and TXT records through public DNS (8.8.8.8) and builds a direct `mongodb://` URL, bypassing the OS DNS client. If it still fails, your network is likely blocking outbound port 27017 — try a different network or mobile hotspot.

**`MongooseServerSelectionError` / connection timeout**
Your current IP isn't on the Atlas **Network Access** allowlist, or the username/password is wrong. Re-add your IP and double-check the credentials.

**App shows a network error but the backend is running**
`BASE_URL` in `mobile/src/api/notesApi.ts` is pointing at the wrong address. See [step 5](#5-point-the-mobile-app-at-your-backend) — `localhost` will not work from a phone or Android emulator.

**Expo Go can't connect to the dev server**
Confirm phone and computer are on the same Wi-Fi, then restart with a tunnel: `npx expo start --tunnel`.

**Stale bundle or odd runtime errors after installing packages**
Clear the Metro cache: `npx expo start -c`.

## License

MIT
