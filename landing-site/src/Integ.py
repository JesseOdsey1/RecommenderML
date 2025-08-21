from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

model = pickle.load(open('ml_model.pkl', 'rb'))
model2 = pickle.load(open('ml_model2.pkl', 'rb'))

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "API is Running"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return jsonify({'Prediction': list(prediction)})

@app.route('/predict2', methods=['POST'])
def predict2():
    data = request.get_json()
    df = pd.DataFrame([data])
    prediction = model2.predict(df)
    return jsonify({'Prediction': list(prediction)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
