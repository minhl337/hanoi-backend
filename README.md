# Tower of Hanoi - Backend API

Node.js + Express + TypeScript backend for the Tower of Hanoi puzzle solver.

## Local Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001

## API Endpoint

### POST /api/hanoi/solve

Solves the Tower of Hanoi puzzle from any valid state.

**Request:**

```json
{
  "n": 4,
  "to": "C",
  "state": {
    "A": [1, 2],
    "B": [3],
    "C": [4]
  },
  "maxMoves": 100
}
```

**Response (full solution - when moves ≤ maxMoves):**

```json
{
  "mode": "full",
  "moveCount": "15",
  "moves": [{ "step": 1, "disk": 1, "from": "A", "to": "C" }]
}
```

**Response (summary - when moves > maxMoves):**

```json
{
  "mode": "summary",
  "moveCount": "127",
  "message": "Too many moves to list or auto-solve. Reduce n to 6 or less."
}
```

**Error Response (400):**

```json
{
  "error": "INVALID_STATE",
  "message": "Invalid state detected. Please Reset."
}
```

## Deploy to Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Deploy

Render automatically provides the `PORT` environment variable.

## Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Run production server                    |
