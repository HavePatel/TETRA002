# Product Requirements Document (PRD)
## AI-Powered Invoice Risk Scanner

**Version:** 1.0
**Status:** Draft

---

## 1. Project Overview

**AI-Powered Invoice Risk Scanner** is an intelligent auditing assistant that automates invoice verification. It extracts invoice data using OCR and AI, validates it against accounting records, detects anomalies, assigns risk scores, and generates AI-powered explanations for every flagged issue.

---

## 2. Problem Statement

Manual invoice auditing is:

- Time-consuming
- Prone to human error
- Vulnerable to fraud
- Prone to duplicate payments
- A source of financial losses

This system automates the auditing process to eliminate these risks.

---

## 3. Objectives

- Automate invoice verification
- Reduce manual effort
- Detect anomalies
- Generate a risk score per invoice
- Explain every detected issue in plain language
- Build an interactive dashboard

---

## 4. Expected Input

- Invoice PDF
- Ledger CSV
- Vendor Master CSV

## 5. Expected Output

- Invoice details
- Detected issues
- Risk score
- AI-generated explanation
- Interactive dashboard
- Downloadable audit report

---

## 6. Features

### Core
- Upload invoice
- OCR
- Data extraction
- Vendor validation
- GST validation
- Duplicate detection
- Amount comparison
- Risk scoring
- Dashboard

### Advanced
- AI explanation
- Downloadable report
- Batch upload
- Invoice search
- Analytics

---

## 7. Tech Stack

| Component | Technology |
|---|---|
| Frontend | React + Tailwind |
| Backend | FastAPI |
| OCR | PaddleOCR |
| AI | Gemini API |
| Data | Pandas |
| Database | SQLite |
| Charts | Recharts |

---

## 8. Architecture

### 8.1 High-Level Flow

```
User Uploads Invoice
        │
        ▼
React Frontend (Dashboard & Upload UI)
        │  REST API
        ▼
FastAPI Backend (API Gateway & Validation)
        │
   ┌────┼────┐
   ▼    ▼    ▼
 OCR  Valid. Risk
   │    │    │
   └────┼────┘
        ▼
Structured Invoice JSON
        │
   ┌────┼────┐
   ▼    ▼    ▼
Ledger  Vendor  SQLite
        │
        ▼
AI Explanation Generator
        │
        ▼
Dashboard + Audit Report
```

### 8.2 End-to-End Workflow

Upload → OCR → Extract Fields → Structured JSON → Compare with Ledger → Compare with Vendor Master → Run Business Rules → Detect Anomalies → Calculate Risk Score → Generate AI Explanation → Display Dashboard → Download Report

### 8.3 Backend Architecture

```
main.py
   │
 ┌─┼─────────────┐
 ▼ ▼             ▼
Upload  Validation  Dashboard API
   │       API           │
   └───────┼─────────────┘
           ▼
     Services Layer
 (OCR, Extraction, Validation,
   Risk, Report Services)
           │
           ▼
 CSV / Database / AI Module
```

### 8.4 OCR + AI Pipeline

Invoice PDF/Image → Pre-processing (image enhancement) → OCR Engine (PaddleOCR) → Raw Text → Gemini API → Structured JSON → Backend Validation

### 8.5 Validation Logic

1. Check invoice number → flag if duplicate
2. Check vendor → flag if unknown
3. Check GST format → flag if invalid
4. Compare amount
5. Compare date
6. Calculate risk score
7. Generate explanation

### 8.6 Risk Scoring Model

| Issue | Weight |
|---|---|
| Duplicate Invoice | +35 |
| Unknown Vendor | +30 |
| GST Invalid | +15 |
| Amount Mismatch | +20 |
| Missing Ledger Entry | +25 |
| Date Mismatch | +10 |

Score is normalized to a 0–100 scale.

| Score Range | Risk Category |
|---|---|
| 0–30 | Low |
| 31–60 | Medium |
| 61–80 | High |
| 81–100 | Critical |

---

## 9. Folder Structure

```
TETRA002/
├── frontend/
├── backend/
├── ai/
├── datasets/
├── docs/
└── assets/
```

---

## 10. Team Responsibilities

### Member 1 — Backend Lead
**Responsible for:** FastAPI, APIs, Validation Engine, Risk Engine, CSV Reading, Database, Integration
**Deliverables:** Upload API, Validation API, Risk API, Dashboard API

### Member 2 — Frontend Lead
**Responsible for:** React, Dashboard, Upload UI, Charts, Tables, Responsive UI
**Deliverables:** Dashboard, Invoice Details page, Upload page, Analytics

### Member 3 — AI Lead
**Responsible for:** OCR, Gemini integration, Invoice Extraction, Prompt Engineering, AI Explanation
**Deliverables:** OCR pipeline, Structured JSON, AI Explanation module

### Member 4 — Project Manager / QA / Documentation
**Responsible for:** Testing, GitHub, README, Presentation, Demo, Bug Reporting, Integration support

---

## 11. Git Workflow

```
main
 ├── feature/backend
 ├── feature/frontend
 ├── feature/ai
 └── feature/docs
```

Nobody commits directly to `main`. All work merges via pull request.

---

## 12. API Specifications

**Base URL (Development):** `http://localhost:8000/api/v1`

### 12.1 Health Check
`GET /health`
Response:
```json
{ "status": "healthy", "message": "Backend is running", "version": "1.0.0" }
```
| Code | Meaning |
|---|---|
| 200 | Server is running |

### 12.2 Upload Invoice
`POST /upload` — `multipart/form-data`

| Parameter | Type | Required |
|---|---|---|
| file | PDF/Image | Yes |

Supported formats: PDF, JPG, PNG

Success:
```json
{ "invoice_id": "INV_001", "filename": "invoice.pdf", "status": "uploaded", "message": "Invoice uploaded successfully" }
```
Error:
```json
{ "error": "Unsupported file format" }
```
| Code | Meaning |
|---|---|
| 201 | Uploaded successfully |
| 400 | Invalid file |
| 500 | Internal server error |

### 12.3 OCR Extraction
`POST /extract` — Owner: **AI**

Request:
```json
{ "invoice_id": "INV_001" }
```
Response:
```json
{
  "success": true,
  "message": "Invoice extracted successfully",
  "data": {
    "invoice_number": "",
    "vendor": "",
    "gstin": "",
    "invoice_date": "",
    "subtotal": 0,
    "gst": 0,
    "total": 0,
    "currency": "INR",
    "confidence": 97.8
  }
}
```

### 12.4 Validate Invoice
`POST /validate` — Owner: **Backend**

Request:
```json
{ "invoice_id": "INV_001" }
```
Response:
```json
{
  "invoice_number": "INV1001",
  "validation_status": "completed",
  "issues": ["Duplicate Invoice", "GST Format Invalid", "Amount Mismatch"]
}
```

Validation checks performed:
- Duplicate invoice check
- Vendor validation
- GST validation
- Amount validation
- Date validation
- Missing ledger entry
- Tax calculation validation

### 12.5 Risk Score
`POST /risk-score` — Owner: **Backend**

Request:
```json
{ "invoice_id": "INV_001" }
```
Response:
```json
{
  "risk_score": 87,
  "risk_level": "High",
  "issues": ["Duplicate Invoice", "GST Invalid", "Amount Mismatch"]
}
```

### 12.6 AI Explanation
`POST /explanation` — Owner: **AI**

Request:
```json
{ "invoice_id": "INV_001" }
```
Response:
```json
{
  "success": true,
  "message": "Explanation generated",
  "data": {
    "summary": "..."
  }
}
```

> The AI module only needs `invoice_id` as input; the backend looks up stored validation results and risk score before generating the explanation.

### 12.7 Invoice Details
`GET /invoice/{invoice_id}` — Owner: **Backend**

Response:
```json
{
  "invoice_number": "INV1001",
  "vendor": "ABC Traders",
  "gstin": "24ABCDE1234F1Z5",
  "date": "2026-08-01",
  "subtotal": 50000,
  "gst": 9000,
  "total": 59000,
  "risk_score": 87,
  "risk_level": "High",
  "issues": ["Duplicate Invoice", "GST Invalid"],
  "explanation": "Invoice number already exists..."
}
```

### 12.8 Dashboard
`GET /dashboard` — Owner: **Backend**

Response:
```json
{
  "total_invoices": 240,
  "high_risk": 18,
  "medium_risk": 37,
  "low_risk": 185,
  "average_risk_score": 42
}
```

### 12.9 Download Report
`GET /report/{invoice_id}` — Owner: **Backend** (Optional)

Response: `audit_report.pdf`

### 12.10 API Flow

```
POST /upload → POST /extract → POST /validate → POST /risk-score
→ POST /explanation → GET /invoice/{id} → GET /dashboard → GET /report/{id}
```

---

## 13. Final API Contract v1.0

| Endpoint | Owner | Status |
|---|---|---|
| GET /health | Backend | ✅ |
| POST /upload | Backend | ✅ |
| POST /extract | AI | ✅ |
| POST /validate | Backend | ✅ |
| POST /risk-score | Backend | ✅ |
| POST /explanation | AI | ✅ |
| GET /invoice/{id} | Backend | ✅ |
| GET /dashboard | Backend | ✅ |
| GET /report/{id} | Backend | Optional |

### 13.1 Standard HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource Created (Upload) |
| 400 | Bad Request |
| 404 | Invoice Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

### 13.2 Standardized Response Format

Every endpoint follows this structure.

**Success:**
```json
{
  "success": true,
  "message": "Invoice uploaded successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Invoice not found",
  "error_code": "INV404"
}
```

### 13.3 Frozen Shared Invoice Schema

All modules (Frontend, Backend, AI) must use this exact schema. Field names must not be renamed once frozen — renaming `invoice_date`, `gst`, `subtotal`, `total`, or `vendor` will break integration.

```json
{
  "invoice_id": "INV_001",
  "invoice_number": "INV1001",
  "vendor": "ABC Traders",
  "gstin": "24ABCDE1234F1Z5",
  "invoice_date": "2026-08-01",
  "subtotal": 50000,
  "gst": 9000,
  "total": 59000,
  "currency": "INR"
}
```

**Design notes:**
- `invoice_id` (system-generated) and `invoice_number` (on the invoice itself) are kept separate intentionally — they represent different things.
- `confidence` is included in the extraction response only, to let the frontend display OCR confidence (e.g., "OCR Confidence: 97.8%").
- `currency` is included even though the project is India-focused, to keep the schema extensible.

---

## 14. Backend Folder Mapping

| API | Module |
|---|---|
| /health | routers/health.py |
| /upload | routers/upload.py |
| /extract | routers/extract.py |
| /validate | routers/validation.py |
| /risk-score | routers/risk.py |
| /explanation | routers/explanation.py |
| /dashboard | routers/dashboard.py |
| /invoice/{id} | routers/invoice.py |
| /report/{id} | routers/report.py |

---

## 15. Hackathon MVP Priority

For a 48-hour hackathon, prioritize these six endpoints to demonstrate the full end-to-end workflow:

1. `GET /health`
2. `POST /upload`
3. `POST /extract`
4. `POST /validate`
5. `POST /risk-score`
6. `GET /dashboard`

`GET /invoice/{id}`, `POST /explanation`, and `GET /report/{id}` can be added if time permits, or mocked for the demo.

---

## 16. Development Timeline

### Day 1
- **Morning:** Repository setup, folder structure, branches, API design
- **Afternoon:** Backend APIs, frontend upload, OCR
- **Night:** Validation, dashboard, integration

### Day 2
- **Morning:** Risk score, testing
- **Afternoon:** Bug fixes, presentation, demo, deployment

---

## 17. Integration Plan

Flow: **AI → Backend → Frontend**

Every module should integrate independently and continuously — don't wait until the last hour to combine work.

---

## 18. Testing Checklist

- Wrong GST
- Duplicate invoice
- Missing vendor
- Amount mismatch
- Date mismatch
- Large files
- Batch upload

---

## 19. Demo Script

Upload invoice → OCR → Extraction → Validation → Risk Score → Dashboard → AI Explanation

---

## 20. Future Scope

- Blockchain verification
- SAP integration
- ERP integration
- Multi-language invoice support
- Email monitoring
- Auto-generated audit reports

---

## 21. Team Working Agreement

### Communication
- One WhatsApp/Discord group for quick updates
- Inform the team before changing shared APIs or folder structures

### Git Rules
- No one pushes directly to `main`
- Create feature branches
- Write meaningful commit messages
- Pull latest changes before starting work

### Code Standards
- Follow the agreed folder structure
- Keep functions modular
- Add comments only where necessary
- Use consistent naming conventions

### Daily Checkpoints
Every 3–4 hours, each member shares:
- What they completed
- What's in progress
- Any blockers

This prevents last-minute surprises.

---

## 22. Recommended Diagrams for Judges

1. High-Level System Architecture — shows the complete system
2. End-to-End Workflow — explains data flow through the application
3. Backend Architecture — demonstrates software design quality
4. Validation Flowchart — highlights business logic and anomaly detection
5. Git Collaboration Workflow — shows a professional development process
