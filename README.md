# AI-Solutions (Computer Systems Engineering) Website

A premium, modern SaaS-styled corporate platform featuring a dynamic Next.js frontend, an Express.js backend, a Sequelize database layer (supporting PostgreSQL & local SQLite fallbacks), JWT admin authentication, and a fully functional virtual chatbot widget.

## Project Structure

```
├── backend/                  # Express.js REST API Server
│   ├── config/               # Database Dialects (Postgre/SQLite)
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Protected route checkers (JWT)
│   ├── models/               # Sequelize Schema Definitions (6 tables)
│   ├── server.js             # Main server & Seeder entrypoint
│   └── database.sqlite       # Local SQLite fallback db (generated automatically)
├── frontend/                 # Next.js App Router Client
│   ├── src/
│   │   ├── app/              # Responsive pages, layouts & routing
│   │   └── components/       # Shared layouts (Navbar, Footer, Chatbot)
│   ├── tailwind.config.ts    # Custom branding themes
│   └── next.config.js        # Media config
├── package.json              # Monorepo startup configurations
└── README.md                 # System instructions documentation
```

## Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Step 1: Install Dependencies
Run the install script from the root folder to download dependencies for both frontend and backend automatically:
```bash
npm run install:all
```

### Step 2: Configure Environment Variables
Copy the `.env.example` in the `backend/` directory to `.env` (already created by default with local fallback values):
```bash
cp backend/.env.example backend/.env
```
Inside the `backend/.env` file, you can customize:
- `DATABASE_URL`: Add your PostgreSQL connection URL (e.g. `postgres://user:pass@localhost:5432/ai_solutions`). If left commented out or invalid, the backend automatically falls back to SQLite (`backend/database.sqlite`) so the system runs immediately!
- `JWT_SECRET`: The token encryption key.
- `ADMIN_DEFAULT_USER` & `ADMIN_DEFAULT_PASSWORD`: Set the default admin profile generated on startup (default is `admin` / `admin123`).
- `OPENAI_API_KEY` or `GEMINI_API_KEY`: Supply keys to connect the chatbot to live LLMs. If left empty, it runs on an intelligent internal NLP keyword responder that answers questions about AI-Solutions' software!

### Step 3: Run the Application
Start both the client and server concurrently using a single command:
```bash
npm run dev
```

- **Next.js Frontend**: [http://localhost:3000](http://localhost:3000)
- **Express Backend**: [http://localhost:5000](http://localhost:5000)

## Design Features
- **Responsive Sticky Navbar**: Interactive navigation with desktop grids and mobile toggle drawers.
- **Floating Chatbot Widget**: An interactive chatbot panel that answers client queries about company services, registrations, and sales. Connects to backend AI models with offline rule-based routing.
- **Interactive Contact Form**: Inquiries are automatically categorized by the backend into specialized buckets (AI Assistants, UI Prototyping, Software Assistance, General) and assigned an inquiry tracking code.
- **Admin Dashboard**: Real-time charts detailing service demand profiles and volume trends. Features an interactive inspector modal enabling status updates (New, In Progress, Processed, Closed).
