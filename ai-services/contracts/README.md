# AI Service Contracts

This folder freezes request/response contracts before model implementation.

Source of truth:

- openapi.yaml
- fixtures/\*.json

Compatibility target:

- backend/src/ai-clients/index.ts
- backend/src/types/index.ts

Do not rename response keys without updating backend types and ai clients.
