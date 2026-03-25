<div align="center">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  
  <h1>🏏 Prediction League Platform</h1>
  <p>The ultimate real-time cricket prediction platform for IPL and international matches. Compete with your friends in private lobbies, predict match outcomes, track player stats, and climb the leaderboard!</p>
</div>

---

## ✨ Features

- **🔐 Google Authentication**: Secure sign-in powered by Supabase Auth.
- **🏠 Private Lobbies**: Create or join custom 6-digit code lobbies to compete exclusively with your friends.
- **📊 Real-time Leaderboards**: Live updating points and rankings using Supabase Realtime subscriptions.
- **🎯 Dynamic Predictions**: Predict match winners, top scorers, and boundaries.
- **🏅 Achievements & Badges**: Unlock custom achievements like "First Prediction", "Hat-Trick", and "Podium Finish".
- **⚡ Live Data Scraper**: Backend built with Express & Cheerio that scrapes live scorecards and Playing XI directly from Cricbuzz.
- **🎨 Premium UI/UX**: Fully responsive, dynamic, glassmorphism-inspired design with butter-smooth micro-interactions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM
- **Database / Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrueAuth + Realtime)
- **Styling**: Pure modern vanilla CSS with dynamic variables and animations.
- **Icons**: Lucide React

### Backend (`/cricket-api-backend`)
- **Server**: Node.js + Express
- **Scraping**: Cheerio + Axios (Live Cricbuzz Match Stats)
- **Caching**: In-memory caching for ultra-fast, rate-limit safe responses.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account for database and authentication.

### 1. Clone the repository
```bash
git clone https://github.com/imkrish0011/predictor.git
cd predictor
```

### 2. Frontend Setup (React/Vite)
Install the dependencies for the client:
```bash
npm install
```

Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:
```bash
npm run dev
```

### 3. Backend Setup (Node/Express API)
Open a new terminal window and navigate to the backend folder:
```bash
cd cricket-api-backend
npm install
```

Start the backend server:
```bash
npm start
```
*(The backend defaults to running locally on port 3000)*

---

## 📂 Project Structure

```text
├── cricket-api-backend/
│   ├── src/
│   │   ├── cache/          # In-memory caching logic for scraper
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Scraper engine (Cheerio)
│   │   ├── utils/          # Parsers and helpers
│   │   └── app.js          # Express app setup
│   ├── package.json
│
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components (Navbar, MatchCards)
│   ├── contexts/           # React Context (AuthContext, LobbyContext)
│   ├── hooks/              # Custom React hooks (useLeaderboard)
│   ├── lib/                # Supabase client initialization & utils
│   ├── pages/              # Main view pages (Dashboard, Profile, Lobby)
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global theme, utility classes, and design system
│   └── main.jsx            # Entry point
│
├── .env                    # Environment variables (Frontend)
├── index.html
├── package.json
└── vite.config.js
```

---

## 📝 Supabase Database Setup 

If you're deploying your own instance, you will need the following database tables setup in Supabase:
- `profiles`: id (uuid), full_name, username, dob, avatar_url
- `lobbies`: id (uuid), code (6-chars), max_users, created_by
- `lobby_members`: lobby_id, user_id, joined_at
- `predictions`: id, user_id, match_id, lobby_id, choices (jsonb)
- `leaderboard`: Materialized view or table tracking points per lobby.

*(Note: Don't forget to enable Google OAuth in the Supabase Authentication Settings!)*

---

## 🚧 Future Roadmap
- [ ] Implement push notifications for toss updates.
- [ ] Add chat functionality inside private lobbies.
- [ ] Dynamic user avatars and profile customization.
- [ ] Global public leaderboard caching.

---

<div align="center">
  <i>Built with ❤️ for Cricket Fans everywhere.</i>
</div>
