from __future__ import annotations

import logging
logger = logging.getLogger("cost-estimation")

import os
from typing import Dict

from fastapi import FastAPI
from pydantic import BaseModel, Field


app = FastAPI(title="Cost Estimation Service", version="1.0.0")

REGIONAL_INFLATION_FACTOR = float(os.getenv("REGIONAL_INFLATION_FACTOR", "1.0"))
MIN_ESTIMATE = int(os.getenv("MIN_ESTIMATE", "1500"))

BASE_COST_BY_DAMAGE: Dict[str, int] = {
    "scratch": 5000,
    "dent": 8000,
    "crack": 12000,
    "broken_part": 15000,
    "paint_damage": 6000,
}

MAKE_FACTORS: Dict[str, float] = {
    "toyota": 1.00,
    "honda": 1.00,
    "hyundai": 0.96,
    "maruti": 0.94,
    "kia": 1.02,
    "bmw": 1.35,
    "audi": 1.38,
    "mercedes": 1.42,
}


class CostEstimationRequest(BaseModel):
    damage_type: str = Field(min_length=2, max_length=40)
    severity_score: float = Field(ge=0.0, le=1.0)
    vehicle_make: str | None = Field(default=None, max_length=60)
    vehicle_model: str | None = Field(default=None, max_length=60)


class CostEstimationResponse(BaseModel):
    estimatedRepairCost: int = Field(ge=0)
    laborCost: int = Field(ge=0)
    partsCost: int = Field(ge=0)
    paintCost: int = Field(ge=0)


def normalize_damage_type(raw: str) -> str:
    normalized = raw.strip().lower().replace(" ", "_")
    if normalized not in BASE_COST_BY_DAMAGE:
        logger.warning(f"Unknown damage type: {normalized}, defaulting to dent")
        return "dent"
    return normalized


def get_make_factor(vehicle_make: str | None) -> float:
    if not vehicle_make:
        return 1.0
    return MAKE_FACTORS.get(vehicle_make.strip().lower(), 1.08)


def split_cost(total: int) -> tuple[int, int, int]:
    labor = round(total * 0.35)
    parts = round(total * 0.45)
    paint = total - labor - parts
    return labor, parts, paint


@app.get("/health")
def health() -> dict:
    return {
        "status": "healthy",
        "service": "cost-estimation",
        "engine": "rule-based-cost-estimation-v1",
        "regionalInflationFactor": REGIONAL_INFLATION_FACTOR,
    }


@app.get("/ready")
def ready() -> dict:
    return {
        "status": "ready",
        "service": "cost-estimation",
        "engine": "deterministic-regression-v1",
    }


@app.post("/estimate-cost", response_model=CostEstimationResponse)
def estimate_cost(payload: CostEstimationRequest) -> CostEstimationResponse:
    logger.info(f"Estimating cost for damage={payload.damage_type}, severity={payload.severity_score}")
    damage_type = normalize_damage_type(payload.damage_type)
    base_cost = BASE_COST_BY_DAMAGE[damage_type]

    severity_factor = 0.75 + (payload.severity_score * 1.25)
    make_factor = get_make_factor(payload.vehicle_make)

    total = round(base_cost * severity_factor * make_factor * REGIONAL_INFLATION_FACTOR)
    total = max(total, MIN_ESTIMATE)

    labor, parts, paint = split_cost(total)

    return CostEstimationResponse(
        estimatedRepairCost=total,
        laborCost=labor,
        partsCost=parts,
        paintCost=paint,
    )
