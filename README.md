# 🤖 AI-Powered Invoice Risk Scanner

*An intelligent auditing assistant that automates invoice verification using OCR, AI, and business rule validation to detect anomalies, calculate risk scores, and generate explainable audit reports.*

![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-success)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![License](https://img.shields.io/badge/License-MIT-orange)

---

## 📌 Project Overview

The AI-Powered Invoice Risk Scanner is an intelligent auditing solution that streamlines invoice verification by combining OCR, Generative AI, and rule-based validation.

Instead of manually reviewing invoices, finance teams can upload invoices and receive:

- 📄 Structured invoice extraction
- ✅ Business rule validation
- ⚠️ Risk scoring
- 🧠 AI-generated explanations
- 📊 Interactive dashboard
- 📑 Downloadable audit reports

---

## 🎯 Problem Statement

Traditional invoice auditing is:

- Time-consuming
- Error-prone
- Difficult to scale
- Vulnerable to duplicate payments
- Susceptible to fraud
- Challenging for GST compliance

Our solution automates the entire workflow, reducing manual effort while improving accuracy and transparency.

---

## ✨ Features

### Core Features

- ✅ Invoice Upload (PDF/JPG/PNG)
- ✅ OCR Text Extraction
- ✅ AI Invoice Data Extraction
- ✅ Vendor Validation
- ✅ GST Validation
- ✅ Duplicate Invoice Detection
- ✅ Ledger Comparison
- ✅ Amount Validation
- ✅ Risk Score Generation
- ✅ AI Explanation
- ✅ Interactive Dashboard

## Screenshots
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/d759eaba-434e-4bef-9245-80f7f2f8f38f" />
<img width="1905" height="982" alt="image" src="https://github.com/user-attachments/assets/aaf249c0-106c-4436-9422-69dba6ba2e31" />
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/d0afb460-66ba-47c7-bc57-c5c67024a53e" />
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/98d661b9-c2d9-4361-91e4-372e488a43cc" />

  

### Advanced Features

- 📥 PDF Audit Report
- 📦 Batch Upload
- 🔍 Invoice Search
- 📈 Analytics Dashboard
- 📱 Responsive UI

---

## 🏗️ System Architecture

```
User
   │
   ▼
React Frontend
   │
REST API
   │
FastAPI Backend
   │
 ├── OCR (PaddleOCR)
 ├── AI Extraction (Gemini)
 ├── Validation Engine
 ├── Risk Engine
 └── Report Generator
   │
SQLite + CSV Datasets
   │
Dashboard & Reports
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI |
| OCR | PaddleOCR |
| AI | Gemini API |
| Database | SQLite |
| Data Processing | Pandas |
| Charts | Recharts |
| PDF Reports | ReportLab |

---

## 📂 Project Structure

```text
TETRA002/
│
├── frontend/
├── backend/
├── ai/
├── datasets/
├── docs/
├── assets/
│
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## 🔄 Application Workflow

```
Upload Invoice
      │
      ▼
OCR Processing
      │
      ▼
AI Field Extraction
      │
      ▼
Structured JSON
      │
      ▼
Validation Engine
      │
      ▼
Risk Score Calculation
      │
      ▼
AI Explanation
      │
      ▼
Dashboard & Report
```

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health Check |
| POST | `/upload` | Upload Invoice |
| POST | `/extract` | AI Extraction |
| POST | `/validate` | Validation |
| POST | `/risk-score` | Risk Analysis |
| POST | `/explanation` | AI Explanation |
| GET | `/invoice/{id}` | Invoice Details |
| GET | `/dashboard` | Dashboard Statistics |
| GET | `/report/{id}` | Download Report |

---

## 🗄️ Database Strategy

For the MVP:

- `ledger.csv` → Accounting records
- `vendor_master.csv` → Approved vendors
- **SQLite** → Stores processed invoices, validation logs, risk scores, and audit history

This approach keeps the system lightweight while demonstrating a complete end-to-end workflow.

---

## 👥 Team Responsibilities

**Backend Lead**
- FastAPI APIs
- Validation Engine
- Risk Engine
- Database
- Integration

**Frontend Lead**
- React Dashboard
- Upload UI
- Charts
- Responsive Design

**AI Lead**
- PaddleOCR
- Gemini API
- Prompt Engineering
- AI Explanation

**Project Manager**
- Testing
- Documentation
- GitHub
- Presentation
- Demo

---

## 🚀 Getting Started

**Clone Repository**

```bash
git clone https://github.com/your-username/TETRA002.git
cd TETRA002
```

**Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- PRD
- Architecture
- API Specification
- Database Design
- Deployment Guide
- Testing Guide
- Demo Script

---

## 🧪 Testing

The project includes validation for:

- Duplicate invoices
- Unknown vendors
- Invalid GSTIN
- Amount mismatches
- Date anomalies
- Missing ledger entries
- Invalid file uploads

---

## 📈 Future Roadmap

- ERP Integration
- SAP Integration
- Blockchain Verification
- Multi-language OCR
- Email Monitoring
- Cloud Deployment
- Multi-tenant Support
- Mobile Application
- Advanced Analytics

---

## 🤝 Contributing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before contributing.

- Create feature branches
- Open Pull Requests
- Follow commit conventions
- Test changes before merging

---

## 📄 License

This project is released under the MIT License.

---

## 🙏 Acknowledgements

Special thanks to the hackathon organizers, mentors, and the open-source community behind FastAPI, React, PaddleOCR, Pandas, and Gemini API for making this project possible.
