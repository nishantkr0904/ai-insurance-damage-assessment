<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

# AutoClaim AI

### AI-Powered Real-Time Vehicle Damage Assessment & Insurance Claim Automation Platform

An intelligent end-to-end platform that revolutionizes insurance claim processing through **Computer Vision**, **Machine Learning**, and **Generative AI**. Submit vehicle damage images and receive instant damage analysis, repair cost estimates, fraud risk assessment, and auto-generated claim reports.

---

## The Problem

Traditional insurance claim processing is:

- **Slow** — Takes days to weeks for manual assessment
- **Inconsistent** — Human assessors vary in judgment
- **Costly** — Requires physical inspections and expert time
- **Fraud-prone** — Manual review misses sophisticated fraud attempts

## The Solution

AutoClaim AI automates the entire workflow:

```
Upload Image → AI Damage Detection → Cost Estimation → Fraud Check → Report Generation
```

**Result:** Claims processed in seconds, not days.

---

## Key Features

| Feature                  | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| **Damage Detection**     | Computer vision identifies scratches, dents, cracks with bounding boxes  |
| **Cost Estimation**      | ML models predict repair costs based on damage severity and vehicle type |
| **Fraud Detection**      | Detects duplicate images, metadata anomalies, and suspicious patterns    |
| **Report Generation**    | LLM-powered auto-generation of structured claim reports                  |
| **Real-time Processing** | Instant AI analysis pipeline with live status updates                    |
| **Role-based Access**    | Separate dashboards for users and administrators                         |
| **Secure Upload**        | AWS S3 integration with file validation                                  |
| **JWT Authentication**   | Secure token-based authentication system                                 |
| **Notifications**        | Real-time alerts for claim status changes                                |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                        │
│                     User Dashboard  │  Admin Dashboard                      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ REST API
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js + Express)                         │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────────┐  │
│  │  Auth   │  │ Claims  │  │  Upload  │  │  Admin  │  │  Notifications   │  │
│  │ Service │  │ Service │  │  Service │  │ Service │  │     Service      │  │
│  └─────────┘  └─────────┘  └──────────┘  └─────────┘  └──────────────────┘  │
└───────┬─────────────┬─────────────┬─────────────┬───────────────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  Damage   │  │   Cost    │  │   Fraud   │  │  Report   │
│ Detection │  │ Estimation│  │ Detection │  │ Generator │
│  (:8000)  │  │  (:8001)  │  │  (:8002)  │  │  (:8003)  │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
     AI MICROSERVICES (Python)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                          │
│            MongoDB Atlas (Claims, Users)  │  AWS S3 (Images)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology    | Purpose          |
| ------------- | ---------------- |
| React 18      | UI Framework     |
| TypeScript    | Type Safety      |
| Vite          | Build Tool       |
| Tailwind CSS  | Styling          |
| Framer Motion | Animations       |
| React Router  | Navigation       |
| Zustand       | State Management |

### Backend

| Technology | Purpose        |
| ---------- | -------------- |
| Node.js    | Runtime        |
| Express.js | Web Framework  |
| TypeScript | Type Safety    |
| Mongoose   | MongoDB ODM    |
| JWT        | Authentication |
| Multer     | File Upload    |
| Winston    | Logging        |

### AI/ML Services

| Technology   | Purpose           |
| ------------ | ----------------- |
| Python       | AI Services       |
| YOLOv8       | Object Detection  |
| OpenCV       | Image Processing  |
| Scikit-learn | Cost Prediction   |
| LangChain    | Report Generation |

### Infrastructure

| Technology    | Purpose          |
| ------------- | ---------------- |
| MongoDB Atlas | Database         |
| AWS S3        | Image Storage    |
| Docker        | Containerization |

---

## Project Structure

```
ai-insurance-damage-assessment/
├── frontend/
│   └── web-app/
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── pages/           # Route pages
│       │   ├── features/        # Feature modules
│       │   ├── services/        # API clients
│       │   ├── stores/          # Zustand stores
│       │   ├── hooks/           # Custom hooks
│       │   └── types/           # TypeScript types
│       └── package.json
├── backend/
│   └── src/
│       ├── controllers/         # Request handlers
│       ├── services/            # Business logic
│       ├── repositories/        # Data access
│       ├── models/              # MongoDB schemas
│       ├── middlewares/         # Auth, validation
│       ├── routes/              # API routes
│       ├── ai-clients/          # AI service clients
│       └── config/              # Configuration
├── ai-services/
│   ├── damage-detection/        # CV damage model
│   ├── cost-estimation/         # ML cost model
│   ├── fraud-detection/         # Fraud algorithms
│   └── report-generation/       # LLM reports
├── docker-compose.yml
└── docker-compose.dev.yml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- AWS Account (for S3)
- Python 3.9+ (for AI services)
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/nishantkr0904/ai-insurance-damage-assessment.git
cd ai-insurance-damage-assessment
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Create Demo Users

```bash
cd backend
npm run seed:demo
```

This creates two demo accounts:

- **Demo User**: `user@autoclaim.ai` / `user123`
- **Demo Admin**: `admin@autoclaim.ai` / `admin123`

See [Demo Users Documentation](docs/DEMO_USERS.md) for more details.

### 4. Frontend Setup

```bash
cd frontend/web-app
npm install
npm run dev
```

### 5. Access the Application

| Service      | URL                                 |
| ------------ | ----------------------------------- |
| Frontend     | http://localhost:5173               |
| Backend API  | http://localhost:5001/api/v1        |
| Health Check | http://localhost:5001/api/v1/health |

**Quick Login:** Use the "Demo User" or "Demo Admin" buttons on the login page for instant access!

---

## Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/insurance-claims

# Authentication
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name

# AI Services
AI_DAMAGE_SERVICE_URL=http://localhost:8000
AI_COST_SERVICE_URL=http://localhost:8001
AI_FRAUD_SERVICE_URL=http://localhost:8002
AI_REPORT_SERVICE_URL=http://localhost:8003

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## API Reference

### Authentication

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | User login        |
| GET    | `/api/v1/auth/profile`  | Get user profile  |

### Claims

| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| POST   | `/api/v1/claims`                     | Create claim with images |
| GET    | `/api/v1/claims`                     | Get user's claims        |
| GET    | `/api/v1/claims/:id`                 | Get claim details        |
| POST   | `/api/v1/claims/:id/analyze-damage`  | Trigger damage analysis  |
| POST   | `/api/v1/claims/:id/estimate-cost`   | Trigger cost estimation  |
| POST   | `/api/v1/claims/:id/fraud-check`     | Run fraud detection      |
| POST   | `/api/v1/claims/:id/generate-report` | Generate AI report       |

### Admin

| Method | Endpoint                           | Description    |
| ------ | ---------------------------------- | -------------- |
| GET    | `/api/v1/admin/claims`             | Get all claims |
| PATCH  | `/api/v1/admin/claims/:id/approve` | Approve claim  |
| PATCH  | `/api/v1/admin/claims/:id/reject`  | Reject claim   |
| GET    | `/api/v1/admin/analytics`          | Get analytics  |

### Notifications

| Method | Endpoint                         | Description       |
| ------ | -------------------------------- | ----------------- |
| GET    | `/api/v1/notifications`          | Get notifications |
| PATCH  | `/api/v1/notifications/:id/read` | Mark as read      |
| PATCH  | `/api/v1/notifications/read-all` | Mark all read     |

---

## API Examples

### Register User

```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Create Claim

```bash
curl -X POST http://localhost:5001/api/v1/claims \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@damage_photo.jpg" \
  -F "vehicle_number=ABC-1234" \
  -F "vehicle_make=Toyota" \
  -F "vehicle_model=Camry" \
  -F "incident_description=Front bumper damage from collision"
```

---

## Application Flow

### Claim Lifecycle

```
1. USER SUBMITS CLAIM
   └─→ Upload images + vehicle info
   └─→ Images stored in S3
   └─→ Claim saved as "submitted"

2. AI DAMAGE DETECTION
   └─→ Image sent to damage service
   └─→ Returns: damage type, severity, bounding boxes
   └─→ Status: "processing"

3. COST ESTIMATION
   └─→ Damage data sent to cost service
   └─→ Returns: labor, parts, total estimate

4. FRAUD DETECTION
   └─→ Images checked for duplicates
   └─→ Metadata analyzed
   └─→ Returns: fraud score, risk level

5. REPORT GENERATION
   └─→ All data sent to LLM service
   └─→ Generates structured claim report
   └─→ Status: "analyzed"

6. ADMIN REVIEW
   └─→ Admin reviews AI results
   └─→ Approves or rejects claim
   └─→ User notified of decision
```

---

## Testing

### Health Check

```bash
curl http://localhost:5001/api/v1/health
# {"status":"ok"}
```

### Full Flow Test

```bash
# 1. Register
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# 2. Login and save token
TOKEN=$(curl -s -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' | jq -r '.data.token')

# 3. Get profile
curl http://localhost:5001/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 4. Get claims
curl http://localhost:5001/api/v1/claims \
  -H "Authorization: Bearer $TOKEN"
```

---

## Docker Deployment

### Development

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose up -d
```

---

## Deployment Guide

### AWS Deployment

1. **EC2 Instance** — Launch Ubuntu 22.04, install Node.js & Docker

2. **MongoDB Atlas** — Create cluster, whitelist EC2 IP

3. **S3 Bucket** — Create bucket, configure CORS, setup IAM user

4. **Environment Setup**

   ```bash
   export NODE_ENV=production
   export MONGODB_URI=mongodb+srv://...
   ```

5. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name insurance-api
   ```

---

## Future Improvements

- [ ] WebSocket for real-time status updates
- [ ] React Native mobile app
- [ ] Multi-language support (i18n)
- [ ] PDF export for claim reports
- [ ] Video-based damage assessment
- [ ] Voice-powered claim submission
- [ ] Blockchain for immutable records
- [ ] Advanced deep learning fraud detection

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## License

MIT License

---

<p align="center">
  Built by <a href="https://github.com/nishantkr0904">Nishant Kumar</a>
</p>
