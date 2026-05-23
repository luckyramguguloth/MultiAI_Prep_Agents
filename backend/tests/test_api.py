from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Job Application Pipeline Backend is running securely."}

def test_trigger_pipeline():
    # Note: This might require mocks if it calls real APIs
    response = client.get("/api/trigger-pipeline")
    assert response.status_code == 200
    assert "triggered successfully" in response.json()["message"]
