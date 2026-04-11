from __future__ import annotations

import os
import sys
from pathlib import Path

import cv2
import numpy as np
from fastapi.testclient import TestClient

SERVICE_DIR = Path(__file__).resolve().parents[1]
if str(SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(SERVICE_DIR))

os.environ.setdefault("MODEL_PATH", str(SERVICE_DIR / "models" / "v2" / "best.pt"))

import app as damage_app

client = TestClient(damage_app.app)


def build_png_bytes() -> bytes:
    image = np.zeros((32, 32, 3), dtype=np.uint8)
    image[8:24, 8:24] = (255, 255, 255)
    success, buffer = cv2.imencode(".png", image)
    assert success
    return buffer.tobytes()


def test_health_and_ready():
    health = client.get("/health")
    ready = client.get("/ready")

    assert health.status_code == 200
    assert ready.status_code == 200
    assert health.json()["status"] == "healthy"
    assert ready.json()["status"] == "ready"
    assert health.json()["service"] == "damage-detection"


def test_analyze_damage_returns_contract(monkeypatch):
    png_bytes = build_png_bytes()

    class Response:
        status_code = 200
        content = png_bytes
        headers = {"Content-Length": str(len(png_bytes))}

    def fake_get(url, timeout):
        return Response()

    monkeypatch.setattr("app.http_session.get", fake_get)
    monkeypatch.setattr(
        "app.detect_damage_regions",
        lambda image: [
            damage_app.BoundingBox(
                x=10.0,
                y=20.0,
                width=40.0,
                height=20.0,
                label="dent",
                confidence=0.88,
            )
        ],
    )
    monkeypatch.setattr("app.compute_severity_score", lambda boxes, shape: 0.67)

    response = client.post("/analyze-damage", json={"image_url": "https://example.com/car.png"})

    assert response.status_code == 200
    body = response.json()
    assert body["damageDetected"] is True
    assert body["damageType"] == "dent"
    assert body["severityScore"] == 0.67
    assert body["confidence"] == 0.88
    assert len(body["boundingBoxes"]) == 1


def test_analyze_damage_rejects_invalid_url():
    response = client.post("/analyze-damage", json={"image_url": "not-a-url"})
    assert response.status_code == 422
