from __future__ import annotations

from fastapi.testclient import TestClient

import app as cost_app


client = TestClient(cost_app.app)


def test_health_and_ready():
    health = client.get('/health')
    ready = client.get('/ready')

    assert health.status_code == 200
    assert ready.status_code == 200
    assert health.json()['status'] == 'healthy'
    assert ready.json()['status'] == 'ready'
    assert health.json()['service'] == 'cost-estimation'


def test_estimate_cost_contract():
    payload = {
        'damage_type': 'dent',
        'severity_score': 0.62,
        'vehicle_make': 'Toyota',
        'vehicle_model': 'Camry',
    }

    response = client.post('/estimate-cost', json=payload)

    assert response.status_code == 200
    body = response.json()

    assert set(body.keys()) == {'estimatedRepairCost', 'laborCost', 'partsCost', 'paintCost'}
    assert body['estimatedRepairCost'] >= 0
    assert body['laborCost'] + body['partsCost'] + body['paintCost'] == body['estimatedRepairCost']


def test_estimate_cost_invalid_severity():
    payload = {
        'damage_type': 'dent',
        'severity_score': 1.7,
        'vehicle_make': 'Toyota',
    }

    response = client.post('/estimate-cost', json=payload)
    assert response.status_code == 422
