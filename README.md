# 🌐 Multi AI Job Prep Agents 🚀

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16--React%2019-black.svg)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-v9-blueviolet.svg)](https://docs.pmnd.rs/react-three-fiber/)
[![CrewAI](https://img.shields.io/badge/AI-CrewAI--v1.14-FF9900.svg)](https://crewai.com/)
[![Security: AES-256](https://img.shields.io/badge/Security-AES--256-red.svg)]()

*A hyper-realistic, 3D multi-agent artificial intelligence system designed to automate the entire job hunting and application process.*

[English](README.md) • [Español](README.es.md) • [中文](README.zh.md)

</div>

---

## 🎮 3D Workspace Engine (Real-Time Dynamic Visualizer)

Below is the live simulation of the **Isometric 3D WebGL Canvas** running in real time. Watch the cubes breathe, bounce, and pulse along the neural pipeline!

<div align="center">
  <img src="3d_visualizer.svg" width="100%" alt="3D Workspace Visualizer" />
</div>

---

## 🏗️ System Architecture

Our multi-agent orchestration architecture processes job leads seamlessly from detection through to document generation:

```mermaid
graph TD
    subgraph Client Layer (React 19 / R3F)
        UI[Next.js WebGL Dashboard]
        WS_CLIENT[WebSocket WSS Client]
    end

    subgraph Security Gateway Layer (WAF & Cryptography)
        API[FastAPI Gateway Router]
        LIMIT[SlowAPI DDoS Rate Limiter]
        CORS[CORS Guard Gate]
        SEC[AES-256 Cryptography Envelope]
    end

    subgraph AI Core Layer (CrewAI Orchestrator)
        ORCH[Central Telemetry Switch]
        A1[Step 1: The Scout]
        A2[Step 2: The Tailor]
        A3[Step 3: The Submitter]
        A3_1[Step 3.1: Problem Solver]
        A4[Step 4: Prep Coach]
        A5[Step 5: Secure Archivist]
        A6[Step 6: Efficiency Recycler]
    end

    subgraph External LLM Interface
        LLM((OpenAI GPT-4o Engine))
    end

    subgraph Secure Ledger Output
        FILE[(Secure Output PDF/JSON Ledger)]
        CACHE[(Reusable Keyword Cache)]
    end

    UI <-->|WebSocket Stream| WS_CLIENT
    WS_CLIENT <-->|Full Duplex WS| API
    API --> LIMIT
    LIMIT --> CORS
    CORS --> SEC
    SEC --> ORCH
    
    ORCH --> A1 & A2 & A3 & A3_1 & A4 & A5 & A6
    A1 & A2 & A3 & A3_1 & A4 -->|Real-time Prompting| LLM
    A5 --> FILE
    A6 --> CACHE
```

---

## 🛠️ Framework Modules

Click on the headers below to inspect the framework layers and system details:

<details>
<summary><b>🧠 1. Multi-Agent AI Core (CrewAI & LangChain)</b></summary>
<br>

The application orchestrates a parallelized 7-agent pipeline configured in `backend/app/agents/crew.py`. Each agent operates with a specific persona:

*   **🕵️ The Scout:** Identifies new vacancy leads matching requirements using semantic search hooks.
*   **👔 The Tailor:** Rewrites and targets applicant resumes to achieve a >94% rating on ATS keyword parsers.
*   **📝 The Problem Solver:** Uses advanced context mappings to solve tricky job application logic/assessments.
*   **📂 The Archivist:** Securely categorizes all PDF, JSON, and Word artifacts.
*   **🔄 The Recycler:** Generates local caches to fast-track similar applications.
</details>

<details>
<summary><b>🎮 2. Interactive WebGL Canvas Layer (React Three Fiber & Three.js)</b></summary>
<br>

Our frontend dashboard features an isometric 3D canvas that transforms raw WebSocket telemetry into physical visual feedback.
*   **Dynamic Motion Shaders:** Elements rotate and float asynchronously based on `useFrame` physics loops to guarantee 60 FPS.
*   **Orbit Controls:** The interface supports zooming, mouse-dragging, and panning boundaries, designed using vanilla viewport bounds.
*   **Responsive Node HTML Overlays:** Dynamically calculated tooltips follow 3D agents as they transition between `IDLE`, `WORKING`, and `ERROR` states.
</details>

<details>
<summary><b>🔒 3. Zero-Trust Security Stack (AES-256 & SlowAPI)</b></summary>
<br>

The application features enterprise security controls designed to safeguard highly sensitive job application files:
*   **Dual Cryptography Envelope:** All uploaded documents and credentials are encrypted on write using AES-256 bit strings managed in `backend/app/core/security.py`.
*   **WAF Throttle (SlowAPI):** Rate limits requests securely (100 per minute) to prevent botnets or brute-force API key depletion.
*   **Strict CORS Policy:** The FastAPI gateway strictly rejects any request not originating from port `3000`.
</details>

## 🔑 API Key Configuration Guide

To enable actual real-time GPT-4o analysis and custom document tailors, you need to configure the core environment secrets. 

### 1. Retrieve Your API Keys
*   **OpenAI API Key (`OPENAI_API_KEY`):** Sign in to your [OpenAI Developer Platform](https://platform.openai.com/), navigate to the API Keys section, and generate a new secret token (starting with `sk-`).
*   **Serper API Key (`SERPER_API_KEY` - Optional):** If you wish to enable the Scout agent to query live search results directly from Google search engines, create a free account on [Serper.dev](https://serper.dev/) and copy your API token.

### 2. Configure Your `.env` File
Create a new file named `.env` inside your **`backend/`** directory (or edit the placeholder file if already present) and populate it with your keys:

```env
# backend/.env
OPENAI_API_KEY="sk-your-real-openai-api-key-here"
SERPER_API_KEY="your-real-serper-api-key-here"
```

> [!IMPORTANT]
> **Mock Fail-safe Active:** If the API keys are not configured or are left as default placeholders, the backend automatically switches to its internal semantic keyword-extraction engine to compile customized cover letters and assessments in real time, preventing service disruptions.

---

## 💻 Operating System & Platform Setup Guides

Select your preferred platform below to view detailed installation and deployment instructions:

### 1. Windows Systems (PowerShell & Command Prompt)

To launch the virtual environment and serve the project locally on Windows environments:

```powershell
# Open terminal and navigate to backend directory
cd backend

# Create Virtual Environment (if not already created)
python -m venv venv

# If running on PowerShell, check script execution policy
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Activate Virtual Environment
.\venv\Scripts\activate

# Synchronize backend dependencies
pip install -r requirements.txt

# Launch FastAPI Backend
uvicorn app.main:app --reload --port 8000
```

*Frontend Console Setup:*
```cmd
cd frontend
npm install
npm run dev
```

---

### 2. macOS & Linux Unix Systems (Bash & Zsh)

Ensure Python 3.10+ is bound to your command path before initializing:

```bash
# Navigate to backend directory
cd backend

# Create Virtual Environment
python3 -m venv venv

# Activate Virtual Environment
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Start local server
uvicorn app.main:app --reload --port 8000
```

*Frontend Console Setup:*
```bash
cd frontend
npm install
npm run dev
```

---

### 3. Containerized Deployments (Docker & Docker Compose)

The application includes a unified `docker-compose.yml` configuration mapping local code volumes and exposing standard network interfaces. This allows you to launch the entire stack (both frontend and backend) on any system with a single command.

Ensure you have **Docker Desktop** installed and running on your system, then execute:

```bash
# From the root directory (containing docker-compose.yml)
# Set your API Key in your shell or pass it directly
docker-compose up --build
```

Docker will:
1. Compile the FastAPI backend image and bind it to `http://localhost:8000`.
2. Compile the Next.js 16 (React 19) node image and bind it to `http://localhost:3000`.
3. Establish live communication channels between containers while maintaining isolated volumes for dependencies.

---


## 📊 Agent Operations Matrix

Below is a technical breakdown of the 8 coordinated agents managed in the orchestrator:

| Agent Identifier | Persona Role | Primary Operational Goal | Real-Time Telemetry Payload |
| :--- | :--- | :--- | :--- |
| `agent_1_scout` | The Scout | Scour the web for vacancies matching filters. | `"Scouted target vacancies matching..."` |
| `agent_2_tailor` | The Tailor | Optimize base resumes to achieve >94% ATS keywords. | `"Tailored resume for matching keywords. ATS: 97%"` |
| `agent_3_submitter` | The Submitter | Compile tailored resumes and prepare payloads. | `"Prepared submission payload..."` |
| `agent_3_1_solver` | Problem Solver | Instantly solve technical assessments and logic tests. | `"Generated answers for technical assessments."` |
| `agent_4_coach` | The Prep Coach | Generate cover letters and interview prep guides. | `"Generated cover letter and custom prep links."` |
| `agent_5_archivist` | The Archivist | Securely organize generated files and assets. | `"Archived tailored resume and prep guides."` |
| `agent_6_recycler` | The Recycler | Cache reusable components for future applications. | `"Updated cache repositories with keyword patterns."` |
| `agent_7_orchestrator` | Orchestrator | Sync websocket logs and run CrewAI tasks. | `"Pipeline successfully completed."` |

---

## 🔌 API Gateway & WebSocket Telemetry Specification

The backend serves endpoints under slowapi WAF rate-limiting. Click the headers below to inspect the telemetry structures:

<details>
<summary><b>📡 1. POST /api/trigger-pipeline (Multipart Form Data)</b></summary>
<br>

Used by the frontend console to submit custom target jobs and optional resume attachments.

*   **Request Type:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Form Parameters:**
    *   `jobDescription` (string, Required): The target job query text.
    *   `resume` (File, Optional): The applicant's base resume document.
*   **Response Scheme (200 OK):**
    ```json
    {
      "message": "Pipeline triggered successfully. Watch the 3D UI!"
    }
    ```
</details>

<details>
<summary><b>📡 2. WS /ws/agents (WebSocket Connection)</b></summary>
<br>

Streams live visual logs and final interview dossiers directly to the 3D WebGL Canvas.

*   **Connection URL:** `ws://localhost:8000/ws/agents`
*   **Active Status Broadcast Schema:**
    ```json
    {
      "agent_id": "agent_1_scout",
      "status": "WORKING",
      "message": "The Scout is actively processing..."
    }
    ```
*   **Pipeline Complete Payload Schema (`PIPELINE_COMPLETE`):**
    ```json
    {
      "event": "PIPELINE_COMPLETE",
      "atsMatchScore": 97,
      "jobTitle": "React 19 Frontend Lead",
      "coverLetter": "Dear Hiring Manager...",
      "technicalAnswers": [
        { "q": "Question text...", "a": "Answer text..." }
      ],
      "prepLinks": [
        { "title": "LeetCode Algorithmic Route", "url": "https://..." }
      ]
    }
    ```
</details>

---

## 🛠️ Dynamic Troubleshooting & Debugging Playbook

If you encounter pipeline bottlenecks or environment issues during execution, expand the entries below for solutions:

<details>
<summary><b>🔍 1. Pydantic ValidationError / Dependency Mismatches</b></summary>
<br>

*   **Symptom:** Backend raises a validation error on start: `pydantic_core._pydantic_core.ValidationError: 2 validation errors for Agent`.
*   **Cause:** LangChain and CrewAI packages are out of sync in your local virtual environment, causing a class validation check mismatch for the `llm` property under Pydantic v2.
*   **Resolution:** Align package versions inside the virtual environment:
    ```powershell
    .\venv\Scripts\activate
    pip install --upgrade crewai langchain-core langchain-openai
    ```
</details>

<details>
<summary><b>🔍 2. Port Conflict (Address Already in Use)</b></summary>
<br>

*   **Symptom:** Running the backend or frontend displays `listen EADDRINUSE: address already in use :::8000` or `:::3000`.
*   **Cause:** A previously started uvicorn server or next dev process is running in the background.
*   **Resolution:** Locate and terminate the matching process on Windows PowerShell:
    ```powershell
    # Find process ID (PID) running on port 8000
    Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
    
    # Find process ID (PID) running on port 3000
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
    ```
</details>

<details>
<summary><b>🔍 3. WebSocket Disconnected (WSS Status Shows "disconnected")</b></summary>
<br>

*   **Symptom:** Frontend dashboard displays status indicator `WSS: disconnected` in red.
*   **Cause:** The FastAPI gateway server is stopped, or the browser is blocking network loops.
*   **Resolution:** Verify that `uvicorn` is actively running on `http://localhost:8000` and check CORS configuration properties in `backend/app/main.py` lines 20-30 to ensure origin matches the frontend host port.
</details>

---

## 🤝 Support, Issues & Feedback

If you encounter any bugs, library bottlenecks, or have feature suggestions regarding the AI agent framework, WebGL visual layouts, or process orchestration:
*   **Open an Issue:** Please navigate to the **Issues** tab in the GitHub repository and click **New Issue**.
*   **Guidelines:** Provide a clear description of the behavior, your active environment versions, and copy-pasteable traceback logs if applicable.
*   **Feedback:** Contributions, pull requests, and creative ideas for adding new 3D props or custom agents are highly welcome!

---

## 🙋 Feel Free to Raise Issues!

Do you have questions about the agent orchestration process, encountered a pipeline roadblock, or want to suggest improvements to the framework? 

Please feel free to open a ticket in the **Issues** tab of this GitHub repository! Whether it is about:
*   **The AI Multi-Agent Orchestration:** Agent logic, prompt design, telemetry feeds, or CrewAI/LangChain integration.
*   **The WebGL 3D Dashboard:** WebGL shadow configurations, responsive CSS glassmorphic modules, canvas overlays, or 3D animations.
*   **System Deployment & Scripts:** Local environment configurations, virtual environments, Docker images, or CLI execution queries.

We actively monitor the issue tracking board and will do our best to guide you through solving any deployment bottlenecks. Let's make this framework more robust together! 🚀

---

## 🛡️ Security Disclaimer

This application processes highly sensitive personal data (resumes, PII, API Keys). **DO NOT** disable the `security.py` AES-256 encryptions or the `slowapi` rate limiters when deploying to the cloud. Always use HTTPS in production.

## 🤝 Contributing

Contributions are welcome! Please check the `CONTRIBUTING.md` file for guidelines on how to add new 3D models or AI agents.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
