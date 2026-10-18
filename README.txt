Personalized Skill Gap Tracking & Recommendation System Using MongoDB
=====================================================================

   Personalized Skill Gap Tracking and Recommendation System Using MongoDB
   School of Computer Science and Engineering, VIT
   Authors: Tharakesha M , Mathu Metha S , Charulatha Venkatraman , Jai Jagannayagam

=================================================================
🌟 PROJECT OVERVIEW
=================================================================
The Personalized Skill Gap Tracking and Recommendation System is a full-stack, database-centric application designed to evaluate a learner's technical competencies against industry-standard benchmarks across 22 Computer Science career roles.

Built natively on MongoDB, the system leverages advanced MongoDB features such as Aggregation Pipelines ($lookup, $unwind, $filter, $max, $multiply), Text Indexes, and flexible document schemas to compute weighted skill gaps, calculate an overall Career Readiness Score (0–100%), determine Multi-Role Alternative Fit, and provide Curated Learning Roadmaps.

=================================================================
🚀 KEY FEATURES
=================================================================

1. Comprehensive CS Career Taxonomy:
   - 22 Specialized roles spanning Software Engineering, AI & Machine Learning, Cloud & DevOps, Cybersecurity, Systems & IoT, Database Architecture, and Product Management.
   - Standardized 1–5 proficiency scale with importance weight factors.

2. Server-Side MongoDB Aggregation Engine:
   - Pure MongoDB pipeline computes skill gaps and priority urgency (priorityScore = gap × weight).
   - Dynamically joins recommended courses from the recommendations collection via $lookup.

3. Career Readiness Score & Multi-Role Fit:
   - Computes weighted overall qualification match %.
   - Cross-evaluates the candidate against all other CS roles to identify alternative career pathways.

4. Smart Resume / Bio Skill Extractor:
   - Paste resume summary or project descriptions; MongoDB text pattern matching extracts recognized skills to instantly populate candidate profiles.

5. Interactive "What-If" Skill Simulator:
   - Dynamic real-time sliders allow candidates to preview how leveling up specific skills impacts their overall readiness without altering database records.

6. Historical Progress Logging (Objective 5):
   - Tracks skill upgrades over time with timestamped snapshots in progressLogs.

7. One-Click Printable Skill Audit Report:
   - Formats the full analysis into a clean, printable PDF / lab report sheet.

=================================================================
🛠️ TECH STACK & ARCHITECTURE
=================================================================

- Database: MongoDB v7 (Running inside Docker container skilltracker-mongo)
- Backend: Node.js, Express.js (v5), TypeScript, MongoDB Node Driver (mongodb)
- Frontend: HTML5, Modern CSS (Tailwind CSS), JavaScript (ES6+), Chart.js
- Containerization: Docker Desktop (mongo:7 on port 27017)

=================================================================
💻 HOW TO RUN THE PROJECT (STEP-BY-STEP GUIDE)
=================================================================

Anyone can clone and run this project in under 2 minutes. Follow the steps below:

>> ⚙️ Prerequisites
-------------------
Ensure you have the following installed on your computer:
1. Node.js (v18 or higher): Download Node.js (https://nodejs.org/)
2. MongoDB:
   - Option A (Local/Docker): Docker Desktop running skilltracker-mongo or local MongoDB Community Server on port 27017.
   - Option B (Cloud MongoDB Atlas): Zero-installation cloud database URI (see below).

>> Step 1: Clone or Download the Project
----------------------------------------

#### Using Git:
``bash
git clone https://github.com/THARAKESHA/personalized-skill-gap-tracker.git
cd personalized-skill-gap-tracker
`

#### OR Download as ZIP (No Git Required):
1. Click the green <> Code button at the top of this repository.
2. Click Download ZIP.
3. Extract the ZIP file and open the folder in your terminal or file explorer.

>> Step 2: Choose Your Running Method
-------------------------------------

#### 🟢 Method A: The 1-Click Launch (Recommended for Windows)
If you are on Windows, simply double-click the file:
`text
run.bat
`
   What run.bat does automatically:
   - Checks if Node.js is installed.
   - Automatically runs npm install if running for the first time.
   - Automatically runs npm run seed to populate roles and skills into MongoDB.
   - Automatically starts the MongoDB Docker container (if Docker is used).
   - Starts the web server and displays the live URL!

#### ⌨️ Method B: Terminal / Command Line (Windows, macOS, Linux)

If you prefer using the terminal (or are on macOS/Linux), run these 3 standard commands:

1. Install Dependencies:
`bash
npm install
`

2. Seed the Database Collections (Roles, Skills & Curated Courses):
`bash
npm run seed
`
(You will see green checkmarks confirming 22 CS roles, 39 skills, and 25 courses are inserted).

3. Start the Web Server:
`bash
npm start
`
(Or use npm run dev for hot-reload development mode).

Expected Terminal Output:
`text
Connected to MongoDB
====================================================
Skill Gap Recognition Server running on http://localhost:4000
Interactive Web UI accessible at http://localhost:4000
====================================================
`

>> Step 3: Open the Web Dashboard
---------------------------------

Open your web browser (Chrome, Edge, Firefox) and navigate to:

>> 👉 http://localhost:4000
--------------------------

>> 🌐 Running with Free Cloud MongoDB Atlas (No Docker Needed)
-------------------------------------------------------------

If you (or your evaluator) do not have Docker or local MongoDB installed:
1. Create a free cluster on MongoDB Atlas (https://www.mongodb.com/cloud/atlas/register).
2. Create a .env file in the project root (copied from .env.example).
3. Add your Atlas connection string:
   `env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skilltracker?retryWrites=true&w=majority
   `
4. Run npm run seed once to populate the cloud database, then run npm start.

>> 🎯 Quick Interactive Walkthrough (What to Test):
--------------------------------------------------

1. Select an Active Profile: In the top navigation bar, choose from sample personas (Alex Kumar, Priya Sharma, Rohan Verma, or Tharakesha), or click + New User to register your own profile.
2. Select Target Career Role: Change the career dropdown to any of the 22 CS roles (e.g. Full Stack Developer, AI/ML Engineer, DevOps Engineer, Cybersecurity Analyst) to watch the MongoDB aggregation engine recalculate gaps in real-time.
3. Inspect the Visual Benchmark: Review the Chart.js side-by-side bar chart (Green = Current Level vs. Purple = Benchmark Required).
4. Explore Alternative Career Match: Look at the left panel to see alternative career pathways your current skillset already qualifies you for.
5. Resume / Bio Extractor: Click Resume Extractor in the header, paste a short project or resume description, and click Scan & Extract to see MongoDB's text indexing extract verified skills automatically!
6. "What-If" Skill Simulator: Click What-If Simulator in the top bar to drag sliders and preview how learning specific skills impacts your overall readiness score.
7. Print Audit Report: Click Print Report to generate a clean, formatted audit sheet ready for lab submission.
8. To Stop the Server: Press Ctrl + C in the command prompt window.

=================================================================
📡 REST API REFERENCE
=================================================================

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/health | System and MongoDB connection status |
| GET | /api/users | List all candidate profiles |
| POST | /api/users | Create a new candidate profile |
| PUT | /api/users/:id | Update candidate skills or target career |
| GET | /api/roles | List all 22 CS career benchmark roles |
| GET | /api/skills | List master standardized skill taxonomy |
| POST | /api/skills/extract | Auto-extract skills from resume/bio text |
| GET | /api/skill-gap/:userId | Full aggregation gap audit, readiness %, and course recommendations |
| POST | /api/skill-gap/simulate | In-memory "What-If" simulator recalculation |
| POST | /api/progress/:userId/level-up | Upgrade a skill level and log historical progress snapshot |
| GET | /api/progress/:userId | Get historical progression logs |

=================================================================
📂 PROJECT DIRECTORY STRUCTURE
=================================================================

`
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
``
