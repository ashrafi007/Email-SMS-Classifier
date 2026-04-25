# SPEC: Email/SMS Spam Classifier — React JS Frontend Only

## Project Overview
Build a single-page React JS web app for an Email/SMS spam classifier.
This spec is FRONTEND ONLY. The backend API will be built separately later.
Use a mock/dummy API response so the UI is fully functional during development.

---

## Project Root Structure
```
EMAIL & SMS CLASSIFIER/
├── .claude/
│   └── spec/
│       └── Front-end.md         ← this file
├── .venv/
├── ml/
│   ├── model.pkl                ← trained ML model (DO NOT TOUCH)
│   ├── processed_data.csv
│   ├── spam.csv
│   ├── Text_Processed_Dataset.csv
│   └── vectorizer.pkl           ← trained vectorizer (DO NOT TOUCH)
├── notebooks/
│   ├── model.ipynb
│   ├── Preprocessing.ipynb
│   └── Text_Preprocessing.ipynb
├── frontend/                    ← ALL FRONTEND WORK GOES HERE
├── backend/                     ← empty for now, built later
└── CLAUDE.md
```

---

## Frontend Folder Structure
All frontend code lives inside `/frontend/`

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx        ← landing section
│   │   ├── ClassifierSection.jsx  ← textarea input + classify button
│   │   ├── ResultCard.jsx         ← spam / not spam result display
│   │   ├── AnimatedBackground.jsx ← GSAP background animation
│   │   └── Loader.jsx             ← loading spinner
│   ├── hooks/
│   │   └── useClassifier.js       ← classification logic + state
│   ├── utils/
│   │   ├── animations.js          ← reusable GSAP animation configs
│   │   └── mockApi.js             ← fake API response (swap later)
│   ├── assets/                    ← images, icons if needed
│   ├── App.jsx                    ← wires all sections together
│   ├── main.jsx                   ← entry point
│   └── index.css                  ← global styles + Tailwind imports
├── .env                           ← VITE_API_URL=http://localhost:5000
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Tech Stack
- React JS (Vite)
- GSAP + ScrollTrigger for all animations
- Axios for API calls
- Tailwind CSS for styling
- Google Fonts: Inter or Poppins

---

## Setup Commands
Run from project root:

```bash
# Step 1 — scaffold frontend
mkdir frontend
cd frontend
npm create vite@latest . -- --template react

# Step 2 — install dependencies
npm install gsap @gsap/react axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Step 3 — create folder structure
mkdir src/components src/hooks src/utils src/assets

# Step 4 — create all files
touch src/components/HeroSection.jsx
touch src/components/ClassifierSection.jsx
touch src/components/ResultCard.jsx
touch src/components/AnimatedBackground.jsx
touch src/components/Loader.jsx
touch src/hooks/useClassifier.js
touch src/utils/animations.js
touch src/utils/mockApi.js
touch .env
```

---

## Mock API (frontend/src/utils/mockApi.js)
Use this until the real backend is ready:

```js
export const mockClassify = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        prediction: message.toLowerCase().includes("win") ? "spam" : "not spam",
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2)
      })
    }, 1500)
  })
}
```

When backend is ready, only update `frontend/src/hooks/useClassifier.js`:
- Replace `mockClassify` with:
  `POST ${import.meta.env.VITE_API_URL}/predict`
- Body: `{ "message": "<user input>" }`
- Response: `{ "prediction": "spam" | "not spam", "confidence": 0.97 }`
- Backend will load model from: `../ml/model.pkl` and `../ml/vectorizer.pkl`

---

## Page Structure (Single Scroll Page)

### Section 1 — Hero / Landing (HeroSection.jsx)
- Full screen (100vh)
- Animated background via AnimatedBackground.jsx (GSAP particles or blobs)
- Title: "Spam Classifier"
- Description: "Instantly detect whether your Email or SMS is spam using AI"
- CTA button: "Check Email / SMS"
- GSAP entrance animations on load:
  - Title: fade + slide up (delay 0.2s)
  - Description: fade in (delay 0.5s)
  - Button: fade in + subtle glow loop

### Section 2 — Classifier Input (ClassifierSection.jsx)
- Hidden below fold initially
- On CTA button click:
  - GSAP smooth scroll down to this section
  - Section animates in: fade + scale 0.95 → 1
- Multiline textarea
- Placeholder: "Paste your email or SMS message here..."
- "Classify" submit button
- Renders Loader.jsx while awaiting response

### Section 3 — Result (ResultCard.jsx)
- Animates in after response:
  - SPAM → red card, shake + flash animation
  - NOT SPAM → green card, smooth fade-in + checkmark
- Shows: prediction label + confidence score
- "Try Another" button → clears input + GSAP scrolls back to Section 2

---

## GSAP Animation Rules (frontend/src/utils/animations.js)
- Register at root: `gsap.registerPlugin(ScrollTrigger)`
- All transitions: duration 0.6–1s, ease: "power3.out"
- Result card entrance: bounce or elastic ease
- Button hover: subtle scale + glow
- NO CSS transitions — all animations via GSAP only
- Use useRef + useEffect for all GSAP calls
- Never use document.querySelector — refs only
- Always cleanup: `return () => ctx.revert()`

---

## Responsiveness (Full Responsive)

### Breakpoints
- Mobile:  320px – 767px
- Tablet:  768px – 1023px
- Desktop: 1024px and above

### Rules
- Hero title: 2rem mobile → 3rem tablet → 4.5rem desktop
- Textarea + buttons: full width on mobile
- Input section: max-width 600px tablet, 800px desktop, centered
- Result card: max-width 500px tablet, 600px desktop, centered
- No horizontal scrollbar at any screen size
- Touch events work for all buttons (tap = click)
- Minimum tap target: 44x44px for all buttons
- AnimatedBackground: reduce/disable particles below 768px for performance
- Glassmorphism cards readable at all screen sizes

---

## Design Guidelines
- Dark theme: #0a0a1a or #111827
- Accent: electric blue #3b82f6 or purple gradient #7c3aed → #3b82f6
- Glassmorphism cards:
  - background: rgba(255,255,255,0.05)
  - backdrop-filter: blur(10px)
  - border: 1px solid rgba(255,255,255,0.1)
- Font: Inter or Poppins (Google Fonts)
- Mobile first
- html { scroll-behavior: smooth }

---

## Important Rules
- Work ONLY inside the `frontend/` folder
- DO NOT touch anything in `ml/`, `notebooks/`, `.venv/`
- DO NOT build any backend code
- DO NOT create Flask, FastAPI, or any Python files
- When backend is ready, ONLY `frontend/src/hooks/useClassifier.js` needs updating
- Use Vite, not Create React App
- One responsibility per component — keep components clean and modular
