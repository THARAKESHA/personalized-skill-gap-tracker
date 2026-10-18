# Personalized Skill Gap Tracking & Recommendation System Using MongoDB

> **Database Systems Lab (BCSE302P)**  
> **Course Project — School of Computer Science and Engineering, VIT**  
> **Authors**: Tharakesha M (24BCE2538) & Team

---

## 🌟 Project Overview
The **Personalized Skill Gap Tracking and Recommendation System** is a full-stack, database-centric application designed to evaluate a learner's technical competencies against industry-standard benchmarks across **22 Computer Science career roles**.

Built natively on **MongoDB**, the system leverages advanced MongoDB features such as **Aggregation Pipelines (`$lookup`, `$unwind`, `$filter`, `$max`, `$multiply`)**, **Text Indexes**, and flexible document schemas to compute weighted skill gaps, calculate an overall **Career Readiness Score (0–100%)**, determine **Multi-Role Alternative Fit**, and provide **Curated Learning Roadmaps**.

---

## 🚀 Key Features

1. **Comprehensive CS Career Taxonomy**:
   - 22 Specialized roles spanning Software Engineering, AI & Machine Learning, Cloud & DevOps, Cybersecurity, Systems & IoT, Database Architecture, and Product Management.
   - Standardized 1–5 proficiency scale with importance weight factors.

2. **Server-Side MongoDB Aggregation Engine**:
   - Pure MongoDB pipeline computes skill gaps and priority urgency (`priorityScore = gap × weight`).
   - Dynamically joins recommended courses from the `recommendations` collection via `$lookup`.

3. **Career Readiness Score & Multi-Role Fit**:
   - Computes weighted overall qualification match %.
   - Cross-evaluates the candidate against all other CS roles to identify alternative career pathways.

4. **Smart Resume / Bio Skill Extractor**:
   - Paste resume summary or project descriptions; MongoDB text pattern matching extracts recognized skills to instantly populate candidate profiles.

5. **Interactive "What-If" Skill Simulator**:
   - Dynamic real-time sliders allow candidates to preview how leveling up specific skills impacts their overall readiness without altering database records.

6. **Historical Progress Logging (Objective 5)**:
   - Tracks skill upgrades over time with timestamped snapshots in `progressLogs`.

7. **One-Click Printable Skill Audit Report**:
   - Formats the full analysis into a clean, printable PDF / lab report sheet.

---

## 🛠️ Tech Stack & Architecture

- **Database**: MongoDB v7 (Running inside Docker container `skilltracker-mongo`)
- **Backend**: Node.js, Express.js (v5), TypeScript, MongoDB Node Driver (`mongodb`)
- **Frontend**: HTML5, Modern CSS (Tailwind CSS), JavaScript (ES6+), Chart.js
- **Containerization**: Docker Desktop (`mongo:7` on port `27017`)

---

## 💻 Quick Start Instructions

### 1. Ensure Docker MongoDB is Running
```powershell
docker start skilltracker-mongo
```
*(If starting from scratch: `docker run -d --name skilltracker-mongo -p 27017:27017 mongo:7`)*

### 2. Install Dependencies (if needed)
```powershell
npm install
```

### 3. Seed Database Collections
Populates 22 CS roles, 39 skills, 25 curated courses, and sample personas:
```powershell
npm run seed
```

### 4. Start the Application
```powershell
npm run start
# Or for live hot-reload development:
npm run dev
```

### 5. Open Web Dashboard
Visit **`http://localhost:4000`** in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System and MongoDB connection status |
| `GET` | `/api/users` | List all candidate profiles |
| `POST` | `/api/users` | Create a new candidate profile |
| `PUT` | `/api/users/:id` | Update candidate skills or target career |
| `GET` | `/api/roles` | List all 22 CS career benchmark roles |
| `GET` | `/api/skills` | List master standardized skill taxonomy |
| `POST` | `/api/skills/extract` | Auto-extract skills from resume/bio text |
| `GET` | `/api/skill-gap/:userId` | Full aggregation gap audit, readiness %, and course recommendations |
| `POST` | `/api/skill-gap/simulate` | In-memory "What-If" simulator recalculation |
| `POST` | `/api/progress/:userId/level-up` | Upgrade a skill level and log historical progress snapshot |
| `GET` | `/api/progress/:userId` | Get historical progression logs |

---

## 📂 Project Directory Structure

```
skill-gap-tracker/
├── public/
│   └── index.html               # Modern Single-Page Dashboard & Report UI
├── src/
│   ├── data/
│   │   ├── roles.json           # 22 Computer Science career benchmarks
│   │   ├── skills.json          # 39 Standardized technical competencies
│   │   ├── recommendations.json # Curated learning resources & courses
│   │   └── users.json           # Sample testing personas
│   ├── routes/
│   │   ├── skillGap.ts          # Core MongoDB aggregation pipeline & simulation
│   │   ├── skills.ts            # Master skills & smart resume extractor
│   │   ├── progress.ts          # Progress snapshots & level-up tracking
│   │   ├── users.ts             # Candidate profile management
│   │   └── targetRoles.ts       # Career roles repository
│   ├── db.ts                    # MongoDB connection pool setup
│   ├── index.ts                 # Express server configuration
│   └── seed.ts                  # Master automated database seeder
├── package.json
├── tsconfig.json
└── README.md
```
