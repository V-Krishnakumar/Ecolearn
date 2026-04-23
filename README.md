# 🌱 EcoLearn

<p align="center">
  <b>AI-Powered Gamified Environmental Education Platform</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-06B6D4?style=for-the-badge&labelColor=111827" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-2563EB?style=for-the-badge&labelColor=111827" />
  <img src="https://img.shields.io/badge/Supabase-Backend-22C55E?style=for-the-badge&labelColor=111827" />
  <img src="https://img.shields.io/badge/Gemini-AI_Tutor-F59E0B?style=for-the-badge&labelColor=111827" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Gamified-Learning-A855F7?style=for-the-badge&labelColor=111827" />
  <img src="https://img.shields.io/badge/Multi_Role-System-14B8A6?style=for-the-badge&labelColor=111827" />
  <img src="https://img.shields.io/badge/Status-Working_Prototype-84CC16?style=for-the-badge&labelColor=111827" />
</p>

---

## 🌍 Vision

<p align="center">
Make sustainability education engaging, practical and accessible for every student.
</p>

---

## 📌 Problem Statement

Traditional environmental education often feels boring, theoretical and disconnected from real action.

Students need:

* Interactive learning
* Real-world challenges
* Progress motivation
* Personalized doubt support
* Engaging experiences

---

## 🚀 Solution

EcoLearn transforms sustainability education into a gamified learning ecosystem with:

* Interactive lessons
* Mini-games
* Quizzes
* Real-world eco tasks
* Leaderboards
* AI Tutor powered by Gemini
* Teacher / Student / Admin roles

---

## 🏗️ System Architecture

```text id="m8a9g2"
         ┌────────────────────┐
         │     Student UI     │
         └─────────┬──────────┘
                   │
                   ▼
         ┌────────────────────┐
         │   React Frontend   │
         └─────────┬──────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐     ┌────────────────┐
│ Supabase Auth │     │ Gemini AI Tutor│
│ Profiles/Data │     │ Smart Q&A      │
└───────────────┘     └────────────────┘
        │
        ▼
┌──────────────────────┐
│ Progress + Scores DB │
└──────────────────────┘
```

---

## ⚙️ Core Features

### 🎮 Gamified Learning

Interactive games for waste management, renewable energy and more.

### 🤖 AI Tutor

Gemini-powered chatbot for environmental doubt solving.

### 📝 Topic Quizzes

Assess learning with module-based quizzes.

### 📸 Real-World Tasks

Upload tree planting, recycling and eco-activities.

### 🏆 Leaderboards & Achievements

Drive motivation through rewards.

### 👥 Multi-Role Access

Students, Teachers and Admin dashboards.

### 🌐 Multilingual Support

English + Hindi support.

---

## 🔄 Learning Flow

```text id="dhhxxl"
Choose Module
→ Watch Lesson
→ Play Mini Game
→ Complete Quiz
→ Earn Points
→ Upload Real Task
→ Climb Leaderboard
```

---

## 🛠️ Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React + TypeScript + Vite |
| Styling  | Tailwind CSS + shadcn/ui  |
| Backend  | Supabase                  |
| AI       | Google Gemini             |
| Charts   | Recharts                  |
| State    | TanStack Query            |

---

## 📂 Repository Structure

```text id="l5s7nn"
src/
├── components/
│   ├── games/
│   └── ui/
├── contexts/
├── pages/
├── lib/
└── App.tsx
```

---

## ⚙️ Quick Start

```bash id="f2w7t6"
npm install
npm run dev
```

Create `.env`

```env id="p9jv5m"
VITE_GOOGLE_API_KEY=your_api_key
```

---

## 🎯 Why It Matters

```text id="4qz4i5"
❌ Passive textbook learning
❌ Low engagement
❌ No real action

✅ EcoLearn turns awareness into action
```

---

## 🔮 Future Improvements

* School analytics dashboard
* More languages
* AI personalized study plans
* Parent portal
* National leaderboard
* Mobile app launch

---

Building education products with real-world impact.
