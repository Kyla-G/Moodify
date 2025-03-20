import os
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Update LOCAL_MODEL_PATH to the path where your local repository is located.
LOCAL_MODEL_PATH = r"C:\Users\Intern\Documents\GitHub\llama-3.1-8B-instruct-mental"

try:
    # Load the model in full precision (float32) on CPU
    model = AutoModelForCausalLM.from_pretrained(
        LOCAL_MODEL_PATH,
        local_files_only=True,  # Use only local files
        torch_dtype="float32",  # CPU typically uses float32
        device_map="cpu"        # Force model to load on CPU
    )
    tokenizer = AutoTokenizer.from_pretrained(
        LOCAL_MODEL_PATH,
        local_files_only=True
    )
    
    # Create the text-generation pipeline using the loaded model and tokenizer
    pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)
    logging.debug("Model loaded successfully in CPU mode.")
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
