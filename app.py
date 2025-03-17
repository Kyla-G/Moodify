from flask import Flask, request, jsonify
from transformers import pipeline
import os
from dotenv import load_dotenv
import logging

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
api_key = os.getenv("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")

pipe = pipeline("text-generation", model="Moonlighthxq/llama-3.1-8B-instruct-mental", use_auth_token=api_key)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        logging.debug(f"Received message: {user_message}")
        response = pipe([{"role": "user", "content": user_message}])
        logging.debug(f"Generated response: {response}")
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)