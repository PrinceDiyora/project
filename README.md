# Agency PM — Marketing Project Management System

A full-stack project management tool built for a 25-person marketing agency. Manage campaigns, tasks, team workload, and client portals.

## Prerequisites

- **Node 18+** (`node -v` to check)
- No other global dependencies required

## Quick Start

```bash
# From the project root — installs all dependencies (root + client + server)
npm install

# Start both frontend (port 5173) and backend (port 3000)
npm run dev
```

Then open **http://localhost:5173** in your browser.

## The 4 Main Views

| Route | Description |
|---|---|
| `/campaigns` | Campaign list with table/card toggle, status filters, deadline sort, and "+New Campaign" |
| `/campaigns/:id` | Campaign detail: tasks, inline status update, progress summary, "+Add Task" |
| `/workload` | Team workload: per-person capacity bars (green/amber/red) with active task list |
| `/client/:clientName` | Read-only client portal: campaign status, progress, and deliverables checklist |

### Navigating to the Client Portal
On the Campaigns list, click the **↗ icon** (ExternalLink) on any row to open that client's portal directly.

## Architecture

```
/client      → React 18 + Vite + Tailwind CSS + React Router v6
/server      → Express + better-sqlite3 (SQLite)
```

- The frontend proxies `/api/*` requests to `http://localhost:3000` via Vite's dev proxy.
- On any API failure, the app falls back to **localStorage-cached data** automatically.
- All CRUD operations (campaigns, tasks) persist in the SQLite database at `server/data/agency.db`.

## API Endpoints

```
GET/POST       /api/campaigns
PUT/DELETE     /api/campaigns/:id
GET/POST       /api/campaigns/:id/tasks
PUT/DELETE     /api/tasks/:id
GET            /api/team
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6
- **Backend**: Node.js, Express 4, better-sqlite3, uuid
- **State**: React Context + custom hooks (`useCampaigns`, `useTasks`)
- **Persistence**: SQLite (primary) + localStorage (fallback)
