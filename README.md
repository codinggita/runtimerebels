# Digital Twin Autopilot 🚀

**Digital Twin Autopilot** is a personal AI clone that integrates with social and communication platforms (Telegram, Discord, Gmail) to automatically reply to messages. The clone mimics your tone, slang, catchphrases, and texting style by using a hybrid approach of a Fine-tuned model (Llama 3.1 8B via Groq/Together AI) and Temporal RAG memories.

> ⚠️ **Development Only Constraint:** Optimized for zero-cost development, local testing, and hackathon demos. Not designed for production scaling.

---

## 🛠️ Tech Stack

*   **Frontend Dashboard:** React 18 (Vite) + Tailwind CSS 3.x
*   **Backend API:** FastAPI (Python 3.11)
*   **AI Orchestration:** LangGraph (StateGraph)
*   **Background Processing:** Celery + Redis
*   **Vector Database:** Qdrant (Local / Cloud)
*   **LLMs:** Groq API / Together AI (Llama 3.1 8B / Fallbacks)
*   **Embeddings:** Sentence-Transformers (`all-MiniLM-L6-v2`)

---

## 📁 Repository Structure

```text
digital-twin-autopilot/
│
├── backend/                         # FastAPI + Celery backend
│   ├── app/
│   │   ├── api/                     # Webhook & REST endpoints
│   │   ├── core/                    # AI Engine (LangGraph routing, RAG, Verifier)
│   │   ├── models/                  # Pydantic schema models
│   │   ├── services/                # Platforms SDKs (Telegram, Discord, Gmail)
│   │   └── workers/                 # Celery async tasks & delay system
│   ├── data/                        # Identity Core + Chat history imports
│   └── requirements.txt             # Python requirements
│
├── frontend/                        # React (Vite) dashboard UI
│
├── docker-compose.yml               # Dev stack orchestrator (Redis, Qdrant, Backend)
├── .env.example                     # Environment setup template
└── README.md                        # Documentation
```

---

## ⚙️ Local Development Setup

### Prerequisites
*   Docker & Docker Compose
*   Node.js (v18+) & NPM

### Step 1: Set up Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

### Step 2: Spin up local services (Redis, Qdrant, Backend)
Use docker-compose to build and start everything:
```bash
docker compose up --build
```
This starts:
*   **FastAPI Backend** on `http://localhost:8000`
*   **Qdrant Vector DB Dashboard** on `http://localhost:6333/dashboard`
*   **Redis** on `http://localhost:6379`

To verify the backend is running, visit: `http://localhost:8000/health`

### Step 3: Run the Dashboard
Navigate to the frontend folder, install dependencies, and run:
```bash
cd frontend
npm install
npm run dev
```
The React dashboard will be running at `http://localhost:5173`.