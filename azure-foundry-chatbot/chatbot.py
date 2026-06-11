"""
Simple console chatbot backed by Azure AI Foundry (Azure OpenAI).

Run:
    python chatbot.py

Requires a .env file (copy from .env.example) with your endpoint + deployment.
"""

import os
import sys

# On corporate networks with TLS-inspecting proxies (Zscaler/Netskope/etc.),
# make Python trust the Windows certificate store, where IT installs the
# corporate root CA. Must run before any HTTPS client is created.
try:
    import truststore

    truststore.inject_into_ssl()
except ImportError:
    pass

from dotenv import load_dotenv
from openai import AzureOpenAI


def build_client() -> tuple[AzureOpenAI, str]:
    load_dotenv()

    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
    api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21")
    auth_mode = os.environ.get("AUTH_MODE", "entra").lower()

    if not endpoint or "<your-resource-name>" in endpoint:
        sys.exit("ERROR: Set AZURE_OPENAI_ENDPOINT in your .env file.")
    if not deployment:
        sys.exit("ERROR: Set AZURE_OPENAI_DEPLOYMENT in your .env file.")

    if auth_mode == "key":
        api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        if not api_key:
            sys.exit("ERROR: AUTH_MODE=key but AZURE_OPENAI_API_KEY is empty.")
        client = AzureOpenAI(
            azure_endpoint=endpoint,
            api_key=api_key,
            api_version=api_version,
        )
    else:
        # Keyless: uses your `az login` session / managed identity.
        from azure.identity import DefaultAzureCredential, get_bearer_token_provider

        token_provider = get_bearer_token_provider(
            DefaultAzureCredential(),
            "https://cognitiveservices.azure.com/.default",
        )
        client = AzureOpenAI(
            azure_endpoint=endpoint,
            azure_ad_token_provider=token_provider,
            api_version=api_version,
        )

    return client, deployment


def main() -> None:
    client, deployment = build_client()

    messages = [
        {"role": "system", "content": "You are a helpful, concise assistant."}
    ]

    print("Chatbot ready (Azure AI Foundry). Type 'exit' or 'quit' to stop.\n")
    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            break

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model=deployment,  # deployment name, not the base model name
            messages=messages,
            temperature=0.7,
        )

        reply = response.choices[0].message.content
        print(f"Bot: {reply}\n")
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
