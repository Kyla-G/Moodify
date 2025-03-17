# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import random  # Replace this with your real model import

# app = Flask(__name__)
# CORS(app)  # Allow requests from frontend

# # Load your trained chatbot model here
# # Example: model = load_model("your_model_path")

# @app.route("/chatbot", methods=["POST"])
# def chatbot_response():
#     data = request.json
#     user_message = data.get("message", "")

#     # Replace this with your model's prediction logic
#     responses = ["Hello!", "How can I help?", "Tell me more!", "I don’t understand."]
#     bot_response = random.choice(responses)

#     return jsonify({"response": bot_response})

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from transformers import pipeline

# 1. Load environment variables
load_dotenv()  # Reads .env file in the same folder

# 2. Set up logging
logging.basicConfig(level=logging.DEBUG)
logging.debug("Starting Flask app...")

# 3. Retrieve Hugging Face token from .env
api_key = os.getenv("HF_API_KEY")  # or whatever variable name you used
if not api_key:
    logging.warning("No HF_API_KEY found in .env. Make sure .env is set properly.")

# 4. Initialize Flask
app = Flask(__name__)

# 5. Initialize the text-generation pipeline
#    - local_files_only=True to ensure it doesn't try to re-download
#    - If you see errors, remove local_files_only=True or specify a local path
try:
    logging.debug("Loading the model (this may take a while)...")
    pipe = pipeline(
        "text-generation",
        model="Moonlighthxq/llama-3.1-8B-instruct-mental",
        use_auth_token=api_key,
        local_files_only=True
    )
    logging.debug("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

# 6. Define the /chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        logging.debug(f"Received user message: {user_message}")

        # 7. Generate text
        # The pipeline returns a list of dicts, e.g. [{"generated_text": "..."}]
        response_data = pipe(
            user_message,
            max_new_tokens=128,      # Adjust tokens as needed
            do_sample=True,
            top_p=0.95,
            temperature=0.7
        )

        # Extract the generated text from the first item
        generated_text = response_data[0]['generated_text']
        logging.debug(f"Generated response: {generated_text}")

        return jsonify({"response": generated_text})

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

# 8. Run the Flask server
if __name__ == '__main__':
    # For development only; use a production server like Gunicorn in real apps
    app.run(host='0.0.0.0', port=5000, debug=True)