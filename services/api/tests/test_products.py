import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


@pytest.fixture
def mock_supabase():
    with patch("routers.products.supabase") as mock:
        yield mock


def test_list_products(mock_supabase):
    mock_supabase.table.return_value.select.return_value.execute.return_value = MagicMock(
        data=[{"id": "uuid-1", "name": "Widget", "price": 9.99, "stock": 10,
               "description": None, "image_url": None, "category": "general"}]
    )
    response = client.get("/products/")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_product_not_found(mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data=None)
    response = client.get("/products/bad-id")
    assert response.status_code == 404
