# AI Module

## Overview

The AI module extracts structured information from invoices, generates audit explanations, and assists in anomaly detection.

## Project Structure

```
ai/
├── api/
│   ├── __init__.py
│   ├── routes.py
│   └── app.py              # FastAPI entry point
│
├── ocr/
│   ├── __init__.py
│   ├── extractor.py
│   └── preprocess.py
│
├── gemini/
│   ├── __init__.py
│   ├── extractor.py
│   ├── explainer.py
│   └── prompts.py
│
├── services/
│   ├── __init__.py
│   ├── extraction_service.py
│   └── explanation_service.py
│
├── schemas/
│   ├── __init__.py
│   ├── request.py
│   └── response.py
│
├── prompts/
│   ├── extraction_prompt.txt
│   └── explanation_prompt.txt
│
├── utils/
│   ├── __init__.py
│   ├── config.py
│   ├── logger.py
│   └── helpers.py
│
├── samples/
│   ├── invoices/
│   └── outputs/
│
├── tests/
│   ├── test_ocr.py
│   ├── test_extractor.py
│   └── test_explainer.py
│
├── requirements.txt
├── .env.example
└── README.md
```

## Setup & Installation

1. Navigate to the `ai` directory:
   ```bash
   cd ai
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your Gemini API Key.
   ```bash
   cp .env.example .env
   ```

4. Run the FastAPI application:
   ```bash
   python -m api.app
   ```
   The server will be running on `http://localhost:8000`. You can access the API docs at `http://localhost:8000/docs`.

## Planned Pipeline

Invoice
    ↓
OCR (PaddleOCR)
    ↓
Text Extraction
    ↓
Structured JSON (Gemini API)
    ↓
AI Explanation & Risk Scoring (Gemini API)
    ↓
Backend Validation

Status: 🚧 Under Development