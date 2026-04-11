from __future__ import annotations

from dotenv import load_dotenv
load_dotenv()

import logging
import os
from typing import List

from ultralytics import YOLO

import cv2
import numpy as np
import requests
from fastapi import FastAPI, HTTPException
from pydantic import AnyHttpUrl, BaseModel, Field
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


app = FastAPI(title="Damage Detection Service", version="1.0.0")
logger = logging.getLogger("damage-detection")

MODEL_PATH = os.getenv("MODEL_PATH")
if not MODEL_PATH:
    raise RuntimeError("MODEL_PATH not set")

model = YOLO(MODEL_PATH)

REQUEST_TIMEOUT_SECONDS = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "15"))
MAX_IMAGE_BYTES = int(os.getenv("MAX_IMAGE_BYTES", str(12 * 1024 * 1024)))

retry_strategy = Retry(
    total=3,
    connect=3,
    read=3,
    backoff_factor=0.5,
    status_forcelist=(408, 429, 500, 502, 503, 504),
    allowed_methods=("GET",),
)
http_session = requests.Session()
http_session.mount("http://", HTTPAdapter(max_retries=retry_strategy))
http_session.mount("https://", HTTPAdapter(max_retries=retry_strategy))


class DamageAnalysisRequest(BaseModel):
    image_url: AnyHttpUrl


class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str
    confidence: float = Field(ge=0.0, le=1.0)


class DamageAnalysisResponse(BaseModel):
    damageDetected: bool
    damageType: str
    severityScore: float = Field(ge=0.0, le=1.0)
    boundingBoxes: List[BoundingBox]
    confidence: float = Field(ge=0.0, le=1.0)


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def load_runtime_status() -> dict:
    return {
        "service": "damage-detection",
        "engine": "yolov8-damage-detection-v2",
        "requestTimeoutSeconds": REQUEST_TIMEOUT_SECONDS,
        "maxImageBytes": MAX_IMAGE_BYTES,
    }


def fetch_image(image_url: str) -> np.ndarray:
    try:
        response = http_session.get(str(image_url), timeout=REQUEST_TIMEOUT_SECONDS)
    except requests.RequestException as exc:
        raise HTTPException(status_code=400, detail=f"Unable to fetch image URL: {exc}") from exc

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Image URL returned HTTP {response.status_code}")

    content_length = response.headers.get("Content-Length")
    if content_length and int(content_length) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds maximum allowed size")

    if len(response.content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds maximum allowed size")

    image_bytes = np.frombuffer(response.content, dtype=np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Unable to decode image bytes")
    return image


def preprocess_image(image: np.ndarray) -> np.ndarray:
    resized = cv2.resize(image, (640, 640), interpolation=cv2.INTER_AREA)
    denoised = cv2.bilateralFilter(resized, d=7, sigmaColor=75, sigmaSpace=75)
    return denoised


def infer_damage_type(aspect_ratio: float, edge_density: float) -> str:
    if aspect_ratio > 3.2 and edge_density > 0.12:
        return "scratch"
    if edge_density > 0.24:
        return "crack"
    if 0.9 <= aspect_ratio <= 1.7:
        return "dent"
    if edge_density < 0.07:
        return "paint_damage"
    return "broken_part"


def detect_damage_regions(image: np.ndarray) -> List[BoundingBox]:
    results = model(image)

    boxes: List[BoundingBox] = []
    for r in results:
        if r.boxes is None:
            continue
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            w = x2 - x1
            h = y2 - y1

            boxes.append(
                BoundingBox(
                    x=float(x1),
                    y=float(y1),
                    width=float(w),
                    height=float(h),
                    label="damage",
                    confidence=round(float(box.conf[0]), 2),
                )
            )

    boxes.sort(key=lambda b: b.width * b.height, reverse=True)
    return boxes[:5]


def compute_severity_score(boxes: List[BoundingBox], image_shape: tuple[int, int, int]) -> float:
    if not boxes:
        return 0.0

    img_area = float(image_shape[0] * image_shape[1])
    total_box_area = sum(b.width * b.height for b in boxes)
    area_ratio = total_box_area / img_area

    avg_conf = sum(b.confidence for b in boxes) / len(boxes)
    raw = (area_ratio * 2.2) + (avg_conf * 0.35)
    return round(clamp(raw, 0.0, 1.0), 2)


@app.get("/health")
def health() -> dict:
    return {"status": "healthy", **load_runtime_status()}


@app.get("/ready")
def ready() -> dict:
    try:
        if model is None:
            raise RuntimeError("Model not loaded")

        return {
            "status": "ready",
            "modelLoaded": True,
            **load_runtime_status(),
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "error": str(e),
        }


@app.post("/analyze-damage", response_model=DamageAnalysisResponse)
def analyze_damage(payload: DamageAnalysisRequest) -> DamageAnalysisResponse:
    logger.info("analyze-damage request received")
    image = fetch_image(payload.image_url)
    processed = preprocess_image(image)

    boxes = detect_damage_regions(processed)

    if not boxes:
        return DamageAnalysisResponse(
            damageDetected=False,
            damageType="none",
            severityScore=0.0,
            boundingBoxes=[],
            confidence=0.0,
        )

    primary = boxes[0]
    severity = compute_severity_score(boxes, processed.shape)
    overall_conf = round(sum(b.confidence for b in boxes) / len(boxes), 2)

    return DamageAnalysisResponse(
        damageDetected=True,
        damageType=primary.label,
        severityScore=severity,
        boundingBoxes=boxes,
        confidence=overall_conf,
    )
