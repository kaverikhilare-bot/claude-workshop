import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


@pytest.fixture
def mock_supabase():
    with patch("routers.customers.supabase") as mock:
        yield mock


def test_create_customer(mock_supabase):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[{"id": "uuid-1", "email": "test@example.com", "full_name": "Test User",
               "phone": None, "address": None, "source": "landing_page",
               "created_at": "2026-01-01T00:00:00", "last_seen_at": None}]
    )
    response = client.post("/customers/", json={"email": "test@example.com", "full_name": "Test User"})
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"


def test_get_customer_not_found(mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data=None)
    response = client.get("/customers/nonexistent-id")
    assert response.status_code == 404
