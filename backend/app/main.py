from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
from loguru import logger
import sys

# SlowAPI for Rate Limiting / WAF Mitigation
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# --- 1. Structured Logging Setup ---
# Configure loguru to output structured JSON logs for the ELK stack / Splunk
logger.remove()
logger.add(sys.stdout, format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}", level="INFO")
logger.add("logs/app.log", rotation="10 MB", serialize=True, level="DEBUG")

# --- 2. FastAPI & Rate Limiting Initialization ---
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app = FastAPI(title="Job Pipeline Production API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- 3. WAF & CORS Security Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Strictly limit to frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# --- 4. WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total active: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast message: {e}")

manager = ConnectionManager()

@app.get("/")
@limiter.limit("5/minute")
def root(request: Request):
    logger.info("Root endpoint accessed")
    return {"message": "Job Application Pipeline Backend is running securely."}

@app.websocket("/ws/agents")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WS data: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/api/trigger-pipeline")
async def trigger_pipeline():
    from .agents.crew import execute_crew_async
    import asyncio
    # Run CrewAI in background task
    asyncio.create_task(execute_crew_async("Sample Job Description"))
    return {"message": "Pipeline triggered successfully. Watch the 3D UI!"}

@app.post("/api/trigger-pipeline")
async def trigger_pipeline_post(
    jobDescription: str = Form(...),
    resume: UploadFile = File(None)
):
    from .agents.crew import execute_crew_async
    import asyncio
    
    resume_name = resume.filename if resume else "Base_Resume.pdf"
    
    # Run CrewAI in background task with the user's custom job description and resume name
    asyncio.create_task(execute_crew_async(jobDescription, resume_name))
    return {"message": "Pipeline triggered successfully. Watch the 3D UI!"}
