# ActionBook

A Google Keep-inspired note-taking app with colorful cards, pin/archive support, and dark/light mode. Built with React Native (Expo) on mobile and a Node.js REST API on the backend.

## Features

- Create, edit, and delete notes with a title and body
- Color-code notes with 8 accent colors
- Pin important notes to the top
- Archive completed notes (swipe them out of the way without deleting)
- Dark and light mode, persisted across sessions
- Clean card-based layout inspired by Google Keep

## Tech Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Mobile   | React Native, Expo SDK 51, TypeScript |
| UI       | React Native Paper                    |
| Backend  | Node.js, Express, TypeScript          |
| Database | MongoDB Atlas via Mongoose            |

## Project Structure

```
ActionBook/
├── backend/          # Express REST API (port 5000)
│   └── src/
│       ├── models/       # Mongoose schemas
│       ├── controllers/  # Route handlers
│       └── routes/       # API routes
└── mobile/           # Expo React Native app
    └── src/
        ├── screens/      # Home, Edit, Archive
        ├── components/   # NoteCard, ColorPicker, EmptyState
        ├── hooks/        # useTheme
        └── api/          # notesApi.ts (HTTP client)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
cp .env.example .env        # add your MONGODB_URI
npm install
npm run dev                 # starts on http://localhost:5000
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

> **Android emulator:** the API base URL is pre-set to `http://10.0.2.2:5000/api`.  
> **Physical device:** update `BASE_URL` in `mobile/src/api/notesApi.ts` to your machine's local IP (e.g. `http://192.168.1.x:5000/api`).

## API Endpoints

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | /api/notes     | List all notes |
| POST   | /api/notes     | Create a note  |
| PUT    | /api/notes/:id | Update a note  |
| DELETE | /api/notes/:id | Delete a note  |

## Environment Variables

Create `backend/.env` from the provided `.env.example`:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## License

MIT
