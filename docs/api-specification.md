# 🚗 AI Insurance Claims Automation Platform

API Specification

This document defines the **REST API contract** for the backend services of the **AI-Powered Real-Time Smart Damage Assessment & Intelligent Insurance Automation Platform**.

The APIs enable communication between:

* Frontend application
* Backend server
* AI processing services
* Cloud storage
* Insurance admin dashboard

The goal is to ensure APIs remain:

* consistent
* predictable
* secure
* easy to maintain

---

# 🌐 Base API Configuration

Base URL:

```
/api/v1
```

Example:

```
https://api.insurai.com/api/v1
```

All APIs must return **JSON responses**.

---

# 📦 Standard Response Format

All endpoints must follow the same response structure.

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

---

### Error Response

```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

---

# 🔐 Authentication APIs

Authentication endpoints handle **user login and token management**.

---

## POST /auth/login

Authenticates a user and returns a JWT token.

### Request

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user_id",
      "name": "Nishant Kumar",
      "role": "user"
    }
  }
}
```

---

## POST /auth/register

Registers a new user.

### Request

```json
{
  "name": "Nishant Kumar",
  "email": "user@email.com",
  "password": "password"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## GET /auth/profile

Returns current authenticated user profile.

Headers:

```
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "Nishant Kumar",
    "email": "user@email.com"
  }
}
```

---

# 📄 Claim Management APIs

These APIs manage **insurance claim creation and retrieval**.

---

## POST /claims

Creates a new insurance claim.

### Request

```
multipart/form-data
```

Fields:

```
vehicle_number
incident_description
images[]
```

### Response

```json
{
  "success": true,
  "data": {
    "claimId": "claim_12345",
    "status": "submitted"
  }
}
```

---

## GET /claims

Returns all claims for a user.

### Response

```json
{
  "success": true,
  "data": [
    {
      "claimId": "123",
      "status": "processing",
      "createdAt": "date"
    }
  ]
}
```

---

## GET /claims/{claimId}

Fetch details of a specific claim.

### Response

```json
{
  "success": true,
  "data": {
    "claimId": "123",
    "status": "analysis_complete",
    "estimatedCost": 12000
  }
}
```

---

# 📷 Image Upload APIs

Handles **vehicle damage image uploads**.

---

## POST /claims/{claimId}/upload-images

Uploads claim images.

### Request

```
multipart/form-data
```

Fields:

```
images[]
```

### Response

```json
{
  "success": true,
  "message": "Images uploaded successfully"
}
```

Images are stored in **AWS S3** and linked to the claim.

---

# 🤖 AI Damage Detection APIs

Triggers AI analysis for uploaded images.

---

## POST /claims/{claimId}/analyze-damage

Starts damage detection using **YOLO / EfficientNet models**.

### Response

```json
{
  "success": true,
  "data": {
    "damageDetected": true,
    "damageType": "scratch",
    "severityScore": 0.68
  }
}
```

---

# 💰 Cost Estimation APIs

Predicts the repair cost using regression models.

---

## POST /claims/{claimId}/estimate-cost

### Response

```json
{
  "success": true,
  "data": {
    "estimatedRepairCost": 13500
  }
}
```

---

# 🛡 Fraud Detection APIs

Detects fraudulent claims using AI validation.

Fraud checks include:

* duplicate image detection
* metadata validation
* anomaly detection

---

## POST /claims/{claimId}/fraud-check

### Response

```json
{
  "success": true,
  "data": {
    "fraudScore": 0.12,
    "riskLevel": "low"
  }
}
```

---

# 📑 Claim Report Generation APIs

Generates automated claim reports using **Generative AI**.

---

## POST /claims/{claimId}/generate-report

### Response

```json
{
  "success": true,
  "data": {
    "reportId": "report_456",
    "reportUrl": "https://storage/reports/report.pdf"
  }
}
```

---

## GET /claims/{claimId}/report

Fetch the generated claim report.

Response:

```json
{
  "success": true,
  "data": {
    "reportUrl": "report-link"
  }
}
```

---

# 📊 Admin APIs

Admin endpoints allow **insurance companies to manage claims**.

Admin authentication required.

---

## GET /admin/claims

Returns all submitted claims.

---

## GET /admin/claims/{claimId}

Fetch full claim analysis.

Includes:

* images
* damage detection results
* cost estimation
* fraud analysis
* generated report

---

## PATCH /admin/claims/{claimId}/approve

Approves a claim.

Response:

```json
{
  "success": true,
  "message": "Claim approved"
}
```

---

## PATCH /admin/claims/{claimId}/reject

Rejects a claim.

Response:

```json
{
  "success": true,
  "message": "Claim rejected"
}
```

---

# 📈 Health & Monitoring APIs

System health monitoring endpoints.

---

## GET /health

Returns backend status.

Response:

```json
{
  "status": "ok"
}
```

---

# 🔐 Security Requirements

All APIs must enforce:

* JWT authentication
* request validation
* rate limiting
* secure file upload
* HTTPS communication

Sensitive endpoints require authentication:

```
/claims/*
/admin/*
```

---

# 🧠 AI Processing Workflow

The backend orchestrates the AI pipeline:

```
User uploads images
↓
Store images in S3
↓
Trigger damage detection
↓
Run cost estimation model
↓
Run fraud detection engine
↓
Generate claim report (GenAI)
↓
Store results in MongoDB
↓
Return analysis to frontend
```

---

# 🚀 API Design Philosophy

APIs must follow these principles:

* clear endpoint naming
* RESTful design
* predictable responses
* strong validation
* minimal business logic in controllers

Prefer **simple and explicit APIs** over overly complex abstractions.