from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
import torch
import joblib
import json
import os
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Load tokenizer once at startup
with open("assets/tokenizer.pkl", "rb") as f:
    tokenizer2 = pickle.load(f)

# Load tokenizer and BERT model
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
bert_model = AutoModel.from_pretrained('distilbert-base-uncased')
bert_model.eval()

# Load your trained logistic regression model
logistic_model = joblib.load("assets\\randomforest_model.pkl")
n_model = joblib.load("assets\\n_model_title.pkl")

# Optional: load label encoder or a JSON label map to map numeric classes to human-readable labels
label_encoder = None
try:
    label_encoder = joblib.load("assets\label_encoder.pkl")
except Exception:
    label_encoder = None

label_encoder2 = None
try:
    label_encoder2 = joblib.load("assets\\n_label_encoder.pkl")
except Exception:
    label_encoder2 = None

CATEGORY_MAP = {}
labels_json_path = os.path.join(os.path.dirname(__file__), "assets", "category_labels.json")
try:
    with open(labels_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)  # expect {"0": "LabelA", "1": "LabelB", ...}
        CATEGORY_MAP = {int(k): str(v) for k, v in data.items()}
except FileNotFoundError:
    pass

# Define input schema
class JobDescription(BaseModel):
    text: str

# Function to get BERT embedding
def get_bert_embedding(text):
    inputs = tokenizer.batch_encode_plus(
        [text],
        return_tensors='pt',
        padding=True,
        truncation=True,
        max_length=128
    )
    with torch.no_grad():
        outputs = bert_model(**inputs)
    # Use the [CLS] token embedding (pooled output)
    cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.numpy()

# API endpoint
@app.post("/predict")
def predict_category(data: JobDescription):
    embedding = get_bert_embedding(data.text)
    # Predict probabilities for each class
    probs = logistic_model.predict_proba(embedding)[0]
    # Classes corresponding to probability columns
    classes = getattr(logistic_model, "classes_", np.arange(len(probs)))
    # Indices of top 5 probabilities
    top_indices = np.argsort(probs)[::-1][:5]

    results = []
    for idx in top_indices:
        class_id = int(classes[idx])
        confidence = float(probs[idx])
        # Map numeric id to human-readable label
        if label_encoder is not None:
            try:
                label = label_encoder.inverse_transform([class_id])[0]
            except Exception:
                label = CATEGORY_MAP.get(class_id, str(class_id))
        else:
            label = CATEGORY_MAP.get(class_id, str(class_id))
        results.append({
            "categoryId": class_id,
            "category": str(label),
            "confidence": confidence
        })

    return {"results": results}


@app.post("/predict2")
async def predict2(request: Request):
    data = await request.json()
    text_input = data.get("text")
    
    if isinstance(text_input, str):
        texts = [text_input]
    else:
        texts = text_input  # In case a list is passed

    # Tokenize and pad
    sequences = tokenizer2.texts_to_sequences(texts)
    X = pad_sequences(sequences, maxlen=50)

    # Predict
    pred_probs = n_model.predict(X)

    # Get top 5 predictions
    top_5 = np.argsort(pred_probs, axis=1)[:, -5:][:, ::-1]
    top_5_probs = np.take_along_axis(pred_probs, top_5, axis=1)

    results = []
    for i in range(len(texts)):
        top_5_labels = label_encoder2.inverse_transform(top_5[i])
        top_5_ids = top_5[i]
        for class_id, label, prob in zip(top_5_ids, top_5_labels, top_5_probs[i]):
            results.append({
                "categoryId": int(class_id),
                "category": str(label),
                "confidence": float(prob)
            })

    return {"results": results}

