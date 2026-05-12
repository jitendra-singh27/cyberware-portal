# CyberAware Portal
## Cybersecurity Awareness Portal — MCA Project MCSP-232
**By Shatrudhan Kumar**

A full-stack cybersecurity education platform with learning modules, quizzes, threat news, incident reporting, community forum, and an admin dashboard.

---

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS     |
| Routing  | Wouter                                       |
| UI       | shadcn/ui + Radix UI + Framer Motion         |
| Backend  | Node.js, Express 5, TypeScript               |
| Database | PostgreSQL + Drizzle ORM                     |
| Auth     | Session-based (express-session)              |
| Charts   | Recharts                                     |

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **pnpm** v9 — `npm install -g pnpm`
- **PostgreSQL** v14+ running locally

---

## Project Structure

```
cyberaware-portal/
├── backend/          ← Express API server (port 5000)
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── routes/
│   │   └── db/
│   │       ├── index.ts
│   │       ├── schema/
│   │       └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/         ← React + Vite app (port 5173)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── hooks/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .env.example
└── package.json      ← Root scripts to run both
```

---

## Setup Instructions

### 1. Clone / Extract the project

```bash
cd cyberaware-portal
```

### 2. Create PostgreSQL Database

```sql
-- In psql or pgAdmin:
CREATE DATABASE cyberaware;
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your PostgreSQL credentials:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cyberaware
SESSION_SECRET=your-very-secret-key-change-this
```

### 4. Install Dependencies

```bash
npm install        # installs root deps
cd backend && npm install
cd ../frontend && npm install
cd ..
```

Or with pnpm:
```bash
pnpm install
cd backend && pnpm install
cd ../frontend && pnpm install
cd ..
```

### 5. Push Database Schema

```bash
cd backend
npx drizzle-kit push
```

### 6. Seed the Database

```bash
cd backend
npx ts-node --esm src/db/seed.ts
# OR after building:
node dist/db/seed.js
```

### 7. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Starts API server on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Opens app on http://localhost:5173
```

Or run both from root:
```bash
npm run dev
```

---

## Default Credentials

| Role  | Email                       | Password    |
|-------|-----------------------------|-------------|
| Admin | admin@cyberaware.com        | admin1234   |
| User  | shatrudhan@example.com      | password123 |

---

## API Endpoints

| Method | Endpoint                          | Description            |
|--------|-----------------------------------|------------------------|
| GET    | /api/healthz                      | Server health check    |
| POST   | /api/auth/register                | Register new user      |
| POST   | /api/auth/login                   | Login                  |
| POST   | /api/auth/logout                  | Logout                 |
| GET    | /api/auth/me                      | Get current user       |
| GET    | /api/content                      | List learning modules  |
| GET    | /api/content/:id                  | Single module          |
| GET    | /api/quizzes                      | List quizzes           |
| GET    | /api/quizzes/:id                  | Quiz + questions       |
| POST   | /api/quizzes/:id/submit           | Submit quiz answers    |
| GET    | /api/news                         | Threat news feed       |
| GET    | /api/reports                      | All reports (admin)    |
| POST   | /api/reports                      | Submit incident report |
| GET    | /api/forum/posts                  | Forum posts            |
| POST   | /api/forum/posts                  | Create post            |
| GET    | /api/forum/posts/:id/replies      | Get replies            |
| POST   | /api/forum/posts/:id/replies      | Add reply              |
| GET    | /api/admin/stats                  | Admin statistics       |

---

## VS Code Tips

- Install **ESLint** and **Prettier** extensions
- Install **TypeScript Vue Plugin** or **TypeScript** extension
- Use **REST Client** extension to test API endpoints
- Set `"editor.formatOnSave": true` in VS Code settings
