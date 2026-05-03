# Email & SMS Spam Classifier

A full-stack web application that detects whether an email or SMS message is **spam** or **ham** using a trained machine learning model — served through a Node.js REST API with a modern animated React frontend.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              React Frontend (Vite)                  │   │
│   │                                                     │   │
│   │  HeroSection ──► ClassifierSection ──► ResultCard  │   │
│   │                        │                            │   │
│   │                  useClassifier.js                   │   │
│   │                     (Axios)                         │   │
│   └──────────────────────┬──────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │  HTTP POST /predict
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               Node.js Backend (Express)                     │
│                                                             │
│   validate.js ──► bridge.js ──► errorHandler.js            │
│                       │                                     │
│               child_process (IPC via stdio)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │  JSON over stdin/stdout
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               Python ML Engine                              │
│                                                             │
│   predict.py                                                │
│     │                                                       │
│     ├── vectorizer.pkl  (TF-IDF)                           │
│     └── model.pkl       (Sklearn Classifier)                │
│                                                             │
│   Pipeline: raw text ──► preprocess ──► vectorize ──► predict │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, GSAP, Axios |
| Backend | Node.js, Express 4, CORS, Morgan |
| ML / Data Science | Python 3.14, scikit-learn, NLTK, pandas, XGBoost |
| Communication | REST API + Node.js child process IPC (stdio) |
| Animations | GSAP with custom blob background |

---

## Features

- **Real-time classification** — paste any message and get an instant spam/ham verdict
- **Confidence score** — model returns a probability alongside the prediction
- **Animated UI** — GSAP-powered animated background, result card bounce (ham) and shake (spam)
- **Robust Python bridge** — backend auto-respawns the Python process on crash with a 30 s startup timeout
- **Input validation** — request body is validated before reaching the ML model
- **Dark-themed, responsive** — mobile-first design with Tailwind CSS

---

## ML Pipeline

```
Raw Message
    │
    ▼
Lowercase + remove non-alphanumeric characters
    │
    ▼
Tokenize (NLTK word_tokenize)
    │
    ▼
Remove English stopwords
    │
    ▼
Porter Stemmer
    │
    ▼
TF-IDF Vectorizer  ◄── vectorizer.pkl
    │
    ▼
Trained Classifier  ◄── model.pkl
    │
    ▼
{ prediction: "spam" | "ham", confidence: 0.0–1.0 }
```

**Training data**: 5 500+ labeled SMS/email messages (`ml/spam.csv`)  
**Notebooks**: see `/notebooks` for preprocessing and training steps

---

## Project Structure

```
Email & SMS classifier/
├── backend/
│   ├── src/
│   │   ├── index.js            # Express server (port 8000)
│   │   ├── bridge.js           # Node ↔ Python IPC bridge
│   │   ├── predict.py          # Python inference script
│   │   └── middleware/
│   │       ├── validate.js     # Request validation
│   │       └── errorHandler.js # Global error handler
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ClassifierSection.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── Loader.jsx
│   │   ├── hooks/
│   │   │   └── useClassifier.js
│   │   └── utils/
│   │       ├── animations.js
│   │       └── mockApi.js
│   ├── vite.config.js
│   └── package.json
├── ml/
│   ├── model.pkl               # Trained classifier
│   ├── vectorizer.pkl          # Fitted TF-IDF vectorizer
│   ├── spam.csv                # Raw dataset
│   └── processed_data.csv      # Preprocessed dataset
└── notebooks/
    ├── Preprocessing.ipynb
    ├── Text_Preprocessing.ipynb
    └── model.ipynb
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Python | ≥ 3.10 |
| pip | latest |

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Email & SMS classifier"
```

### 2. Set up Python virtual environment

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install scikit-learn nltk pandas numpy xgboost joblib
```

Download required NLTK data (one-time):

```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MODEL_DIR=../../ml
PYTHON_BIN=../../.venv/bin/python
FRONTEND_URL=http://localhost:5173
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## Running the App

Open two terminals:

**Terminal 1 — Backend**

```bash
cd backend
npm start
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## API Reference

### `GET /health`

Returns the server and model status.

```json
{ "status": "ok", "model": "loaded" }
```

### `POST /predict`

Classifies a message as spam or ham.

**Request**

```json
{
  "message": "Congratulations! You've won a $1,000 gift card. Click here to claim."
}
```

**Success response** `200`

```json
{
  "prediction": "spam",
  "confidence": 0.97
}
```

**Validation error** `400`

```json
{
  "error": "INVALID_INPUT",
  "detail": "message must be a non-empty string"
}
```

**Server error** `500`

```json
{
  "error": "PREDICTION_FAILED",
  "detail": "Python bridge returned an error"
}
```

---

## Dataset

The model was trained on the [SMS Spam Collection Dataset](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset), containing 5 574 English SMS messages labelled as **spam** or **ham**.

| Class | Count |
|---|---|
| ham | 4 827 |
| spam | 747 |

---

## License

MIT
