import sys
import json
import pickle
import os
import nltk
import string
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

ps = PorterStemmer()


def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)
    y = []
    for i in text:
        if i.isalnum():
            y.append(i)
    text = y[:]
    y.clear()
    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)
    text = y[:]
    y.clear()
    for i in text:
        y.append(ps.stem(i))
    return " ".join(y)


def main():
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: predict.py <model_dir>\n")
        sys.exit(1)

    model_dir = sys.argv[1]

    nltk.download('punkt_tab', quiet=True)
    nltk.download('stopwords', quiet=True)

    vectorizer_path = os.path.join(model_dir, 'vectorizer.pkl')
    model_path = os.path.join(model_dir, 'model.pkl')

    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)
    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    sys.stdout.write(json.dumps({"status": "ready"}) + "\n")
    sys.stdout.flush()

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        req_id = None
        try:
            req = json.loads(line)
            req_id = req.get("id")
            text = req.get("text", "")

            transformed = transform_text(text)
            vec = vectorizer.transform([transformed])

            proba = model.predict_proba(vec)[0]
            label = model.predict(vec)[0]
            prediction = "spam" if label == 1 else "ham"
            confidence = round(float(proba[label]), 4)

            result = {"id": req_id, "prediction": prediction, "confidence": confidence}
        except Exception as e:
            result = {"id": req_id, "error": str(e)}

        sys.stdout.write(json.dumps(result) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
