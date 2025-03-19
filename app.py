import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from transformers import pipeline

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
api_key = os.getenv("HF_API_KEY")

try:
    pipe = pipeline(
        "text-generation",
        model="Moonlighthxq/llama-3.1-8B-instruct-mental",  # Make sure this is correct
        use_auth_token=api_key,
        torch_dtype="auto",
        device_map="auto",    # Automatically place on GPU if available
        load_in_8bit=True
    )
    logging.debug("Model loaded successfully in 8-bit.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    try:
        response = pipe(user_message, max_new_tokens=128)
        generated_text = response[0]["generated_text"]
        return jsonify({"response": generated_text})
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
