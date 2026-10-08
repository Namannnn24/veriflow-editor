# VeriFlow — The Verified Writing Platform

VeriFlow is an academic & professional integrity editor and verification platform. It tracks the chronological evolution of a document — logging typed keystrokes, clipboard paste actions, and AI interactions — to compute an authentic, transparent **Integrity Score**.

---

## 🌟 Features

- **Full-Stack Architecture**: Powered by React 19, Tailwind CSS 3, Express 5, and SQLite (`better-sqlite3`).
- **User Authentication**: Secure JWT-based authentication with salted `bcryptjs` password hashing.
- **Document Management**: Create, view, edit, auto-save, and delete drafts in an intuitive dashboard.
- **Advanced Keystroke & Behavioral Tracking**:
  - Millisecond-accurate timestamping of typing bursts, paste events, and character deltas.
  - Heuristic detection of copy-pasting, suspicious rapid-typing bursts, and subsequent manual revision recovery.
- **Transparent AI Sandbox**:
  - Dedicated AI sandbox assistant for drafting and structuring content.
  - Automatically watermarks and cites generated output within the document body.
- **Real-Time Audit Panel**:
  - Live SVG animated integrity donut score gauge (Verified, Mixed, Flagged).
  - Detected pattern warnings with actionable feedback.
  - Real-time terminal-style event streaming log.
- **Verification Certificates & Reports**:
  - Immutable submission records stored with behavioral metadata.
  - Official print-ready Verification Certificate (`/report/:id`) with SVG progress visualization and unique audit verification hash.

---

## 🚀 Getting Started

### 1. Installation

```bash
cd veriflow-editor
npm install
```

### 2. Running in Development Mode

Run both the Express backend (`localhost:3001`) and the Vite client (`localhost:5173`) concurrently:

```bash
npm run dev:full
```

Or run them individually:

```bash
# Terminal 1 - Backend Server (Port 3001)
npm run dev:server

# Terminal 2 - Frontend Development Server (Port 5173)
npm run dev
```

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

### 3. Production Build

```bash
npm run build
```

---

## 📁 Project Structure

```
veriflow-editor/
├── server/                      # Express Backend
│   ├── db.js                    # SQLite connection & schema initialization
│   ├── index.js                 # Express application entry & middleware
│   ├── middleware/
│   │   └── auth.js              # JWT Bearer token authentication
│   └── routes/
│       ├── auth.js              # /api/auth (signup, login, me)
│       ├── documents.js         # /api/documents (CRUD, auto-save)
│       └── submissions.js       # /api/submissions (submit, report ledger)
├── src/
│   ├── api.js                   # Client API layer & fetch wrappers
│   ├── context/
│   │   └── AuthContext.jsx      # Global React authentication provider
│   ├── components/
│   │   ├── AISandbox.jsx        # Transparent AI prompt & citation modal
│   │   ├── AuditPanel.jsx       # Real-time sliding integrity monitor
│   │   ├── DocumentCard.jsx     # Dashboard document item with preview
│   │   ├── Editor.jsx           # Clean distraction-free typography editor
│   │   ├── IntegrityBadge.jsx   # Status indicator badge
│   │   ├── Layout.jsx           # App layout with top navigation
│   │   ├── Navbar.jsx           # Responsive header navigation
│   │   └── ProtectedRoute.jsx   # Route guard for authenticated views
│   ├── pages/
│   │   ├── Dashboard.jsx        # Documents management & quick stats
│   │   ├── EditorPage.jsx       # Full-screen workspace with auto-save & audit
│   │   ├── Landing.jsx          # High-converting SaaS landing page
│   │   ├── Login.jsx            # Sign in screen
│   │   ├── Report.jsx           # Printable verified certificate view
│   │   ├── Signup.jsx           # Account creation screen
│   │   └── Submissions.jsx      # Certified submission history
│   ├── utils/
│   │   └── integrity.js         # Integrity scoring heuristics engine
│   ├── App.jsx                  # React Router configuration
│   ├── index.css                # Tailwind directives & design tokens
│   └── main.jsx                 # Client entry point
├── vite.config.js               # Vite config with backend proxy
└── tailwind.config.js           # Custom typography & color palette
```

---

## 🛡️ Integrity Engine Scoring Breakdown

The heuristic scoring engine evaluates four criteria:

1. **Paste Penalty**: Calculates the ratio of pasted characters to total document volume. High paste percentages without subsequent manual typing reduce the score.
2. **AI Transparency Penalty**: AI injections from the sandbox are logged with citation tags.
3. **Burst Penalty**: Flags instant text insertions (>50 characters in a single event) outside regular keystroke frequency.
4. **Hybrid Recovery Bonus**: If substantial manual typing and editing occurs *after* a paste or burst event, the engine recognizes authentic revision effort and recovers up to +40 points.
