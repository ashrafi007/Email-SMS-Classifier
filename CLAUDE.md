# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

Python 3.14 with a local virtual environment at `.venv/`. Activate it before running anything:

```bash
source .venv/bin/activate
```

Launch Jupyter to work with notebooks:

```bash
jupyter notebook
```

NLTK data (`punkt_tab`, `stopwords`) must be downloaded once per environment — the notebooks handle this automatically on first run.

## Project Architecture

This is a spam classification ML pipeline for SMS/email messages, split across three sequential notebooks in `notebooks/`:

### Pipeline Order

1. **`Preprocessing.ipynb`** — Raw data ingestion and EDA  
   - Reads `ml/spam.csv` (raw UCI SMS Spam Collection dataset, `latin-1` encoded)  
   - Cleans columns, label-encodes target (`ham=0`, `spam=1`), drops 403 duplicates (5572 → 5169 rows)  
   - Engineers three features: `num_characters`, `num_words`, `num_sentences`  
   - Outputs `ml/processed_data.csv`

2. **`Text_Preprocessing.ipynb`** — NLP text transformation  
   - Reads `ml/processed_data.csv`  
   - Applies `transform_text()`: lowercase → tokenize → keep alphanumeric only → remove stopwords → Porter stem  
   - Generates word clouds and top-30 word frequency charts for spam vs. ham  
   - Outputs `Text_Processed_Dataset.csv` with a new `transformed_text` column

3. **`model.ipynb`** — Vectorization, model training, and export  
   - Reads `Text_Processed_Dataset.csv`  
   - Vectorizes `transformed_text` with TF-IDF (`max_features=3000`)  
   - Trains and compares 11 classifiers (Naive Bayes variants, SVM, RF, LR, KNN, XGBoost, etc.)  
   - **Selected model**: `MultinomialNB` — precision=1.0, accuracy=97.5% on 80/20 split  
   - Saves `vectorizer.pkl` and `model.pkl` via `pickle`

### Key Data Facts

- Dataset is imbalanced: 87.37% ham / 12.63% spam — precision is the primary metric (false positives matter more than false negatives)
- Spam messages are characteristically longer (~138 chars avg) vs. ham (~70 chars avg)
- TF-IDF with 3000 features is the vectorization approach; CountVectorizer was evaluated but not selected

### Dependencies

All managed via pip into `.venv/`. Key packages: `pandas`, `scikit-learn`, `nltk`, `matplotlib`, `seaborn`, `wordcloud`, `xgboost`.
