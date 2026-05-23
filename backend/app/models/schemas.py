from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List

# Strict schemas for input sanitization against prompt injections

class JobPosting(BaseModel):
    url: HttpUrl
    job_title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=10000, description="Strict limit to avoid giant prompt injections")

class AgentStateUpdate(BaseModel):
    agent_id: str
    status: str # "IDLE", "WORKING", "ERROR"
    message: Optional[str] = None
