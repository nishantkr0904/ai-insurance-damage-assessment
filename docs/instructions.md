# Development Instructions

This repository contains the implementation of an AI-powered insurance damage assessment platform.

Developers and AI assistants must follow the architecture defined in this document.

---

# System Architecture Reference

The system architecture and processing pipeline are defined in:

docs/architecture.md

Developers must follow that architecture when implementing services.

---

# Development Rules

1. Follow modular architecture.
2. AI models must be implemented as independent services.
3. All APIs must follow REST principles.
4. Authentication must use JWT tokens.
5. Code must be documented and typed.

---

# Backend Guidelines

Node.js API handles:

- authentication
- claim submission
- AI service communication
- database operations

---

# AI Service Guidelines

Each AI module must be isolated:

damage-detection-service
cost-estimation-service
fraud-detection-service
report-generation-service

These services communicate via REST APIs.

---

# Frontend Guidelines

Frontend must support:

- mobile responsive UI
- PWA capability
- image upload
- claim status tracking
- admin dashboard

---

# Deployment Rules

Services must run inside Docker containers.

Infrastructure components:

- API Server
- AI Service
- MongoDB
- Object Storage

---

# Coding Standards

- Use clean architecture
- Use environment variables
- Write modular functions
- Add tests for critical modules