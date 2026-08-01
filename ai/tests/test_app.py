from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint() -> None:
    """Test the root GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Service is running"}

def test_health_endpoint() -> None:
    """Test the health GET /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "AI Service is healthy",
        "version": "1.0.0"
    }
