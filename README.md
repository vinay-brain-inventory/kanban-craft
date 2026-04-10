# Kanban Craft

A full-stack Kanban board: sign up or log in, manage tasks across columns (todo → in progress → review → done), assign teammates, and drag tasks between columns. Data is stored in MongoDB and scoped per authenticated user.

## Tools & stack

| Layer | Technology |
|--------|------------|
| **Frontend** | [React](https://react.dev/) 19, [Vite](https://vitejs.dev/) 8, [TypeScript](https://www.typescriptlang.org/) |
| **State & HTTP** | [Redux Toolkit](https://redux-toolkit.js.org/), [React Redux](https://react-redux.js.org/), [Axios](https://axios-http.com/) |
| **Build / DX** | ESLint, [React Compiler](https://react.dev/learn/react-compiler) (Babel), `@vitejs/plugin-react` |
| **Backend** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) 5 (ES modules) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Auth** | [JWT](https://jwt.io/) (access token in httpOnly-style flow via cookie), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |
| **Other server libs** | [dotenv](https://github.com/motdotla/dotenv), [cors](https://github.com/expressjs/cors), [cookie-parser](https://github.com/expressjs/cookie-parser) |

Default URLs: API `http://localhost:5000`, frontend dev server `http://localhost:5173`. The frontend calls the API using `VITE_API_URL` (falls back to `http://localhost:5000`).

---

## Application flow

### 1. Server startup (backend)

1. **Environment** — `server.js` loads config from `.env` (via `dotenv`) and requires `MONGODB_URI` and `JWT_ACCESS_SECRET`.
2. **Database** — `bootstrap.js` connects to MongoDB (`connectMongo`).
3. **Seed (optional)** — If collections are empty, `seed.js` can create a demo user, assignees, and sample tasks.
4. **Composition** — Services (auth, assignees, tasks) and controllers are wired, then `createApp` builds the Express app with routes and middleware.
5. **Listen** — The API listens on `PORT` (default `5000`).

### 2. HTTP API shape

- **`GET /api/health`** — Liveness check (no auth).
- **`/api/auth`** — `POST /login`, `POST /signup`, `GET /me`, `POST /logout`. Successful login/signup sets an auth cookie; `/me` reads it to restore the session.
- **`/api/assignees`** and **`/api/tasks`** — Protected by `requireAuth`: JWT from the cookie is verified; `req.userId` is set for data scoping.
- **Tasks** — CRUD-style: list, get by id, create, patch (e.g. status for drag-and-drop), delete.
- **Errors** — Unknown routes → 404 middleware; failures → centralized `errorHandler`.

### 3. Frontend runtime flow

1. **`main.tsx`** — Renders the app inside `Redux` `<Provider>` and React `StrictMode`.
2. **`App.tsx`** — On mount, dispatches `bootstrapAuth()` which calls `GET /api/auth/me` with credentials. Until bootstrap finishes, nothing is shown; then:
   - If a user exists → **`BoardPage`** (Kanban UI).
   - Otherwise → **`AuthPage`** (login / signup).
3. **Axios** — `api.ts` uses a shared client with `withCredentials: true` so cookies are sent. A response interceptor dispatches logout on **401** so expired or invalid sessions return to the auth screen.
4. **`BoardPage`** — After login, loads assignees and tasks via Redux thunks, shows columns, search, create/edit modals, and HTML5 drag-and-drop to change task status; updates are sent with `PATCH` to the API.

End-to-end path for a typical action (e.g. move a task): **Browser** → **Redux thunk** → **Axios** → **Express route** → **controller** → **service** → **Mongoose** → **MongoDB**, then JSON back through the same chain to update the UI.

---

## Quick start

**Backend** (`backend/`): create `.env` with at least `MONGODB_URI` and `JWT_ACCESS_SECRET`; optional `CORS_ORIGIN` (default matches Vite), `PORT`. Then:

```bash
cd backend && npm install && npm run dev
```

**Frontend** (`frontend/`): optional `.env` with `VITE_API_URL=http://localhost:5000`. Then:

```bash
cd frontend && npm install && npm run dev
```

If the database was seeded on first run, you can sign in with **demo@kanban.craft** / **demo1234** (see `backend/src/seed.js`).
