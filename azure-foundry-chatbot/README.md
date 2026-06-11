# Azure AI Foundry Chatbot

A simple chatbot backed by an Azure AI Foundry (Azure OpenAI) model deployment.
Comes in two flavors:

- `chatbot.py` — console chatbot
- `app.py` — web UI (Streamlit)

## Prerequisites

- Python 3.10+
- Azure CLI (`az`) — for keyless (Entra ID) auth
- An Azure AI Foundry project with a deployed chat model (e.g. `gpt-4o-mini`)
- Either the **Cognitive Services OpenAI User** role (keyless auth) **or** an API key

## Setup

```powershell
# 1. Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Install dependencies
python -m pip install -r requirements.txt

# 3. Configure your environment
copy .env.example .env
#    Edit .env: set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT
```

## Auth options

Set `AUTH_MODE` in `.env`:

- `entra` (recommended): keyless. Run `az login` first; your identity needs the
  **Cognitive Services OpenAI User** role on the resource.
- `key`: paste `AZURE_OPENAI_API_KEY` from the deployment page.

## Run

```powershell
# Console
python chatbot.py

# Web UI
streamlit run app.py
```

## Where to find the values

Azure AI Foundry portal (https://ai.azure.com) -> your project ->
**Models + endpoints** -> open your deployment:

- **Endpoint** -> `AZURE_OPENAI_ENDPOINT`
- **Deployment name** -> `AZURE_OPENAI_DEPLOYMENT`
- **Key** (if using key auth) -> `AZURE_OPENAI_API_KEY`

## Corporate network / TLS inspection (Wipro)

If `pip install` fails with `CERTIFICATE_VERIFY_FAILED: unable to get local
issuer certificate`, your network has a TLS-inspecting proxy. Install by
trusting the PyPI hosts for the download:

```powershell
python -m pip install `
  --trusted-host pypi.org --trusted-host files.pythonhosted.org `
  -r requirements.txt
```

At runtime the app already calls `truststore.inject_into_ssl()` so HTTPS calls
to Azure use the Windows certificate store (where IT installed the corporate
root CA). No code changes needed.

## Notes

- The model is stateless. "Memory" is just the growing `messages` list resent
  on each request.
- Never commit `.env` — it's in `.gitignore`.
