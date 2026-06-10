import os
import httpx
from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# Use a custom httpx client that skips SSL verification (needed for corporate proxies)
http_client = httpx.Client(verify=False)
client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    http_client=http_client
)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # Fast and cheap for demos
        max_tokens=1024,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )

    reply = response.content[0].text
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
