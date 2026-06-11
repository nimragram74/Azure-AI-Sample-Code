"""
Web UI chatbot (Streamlit) backed by Azure AI Foundry (Azure OpenAI).

Run:
    streamlit run app.py
"""

import streamlit as st

from chatbot import build_client

st.set_page_config(page_title="Foundry Chatbot", page_icon="🤖")
st.title("🤖 Azure AI Foundry Chatbot")


@st.cache_resource
def get_client():
    return build_client()


client, deployment = get_client()

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "You are a helpful, concise assistant."}
    ]

# Render history (skip the system prompt)
for msg in st.session_state.messages:
    if msg["role"] == "system":
        continue
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Type a message..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model=deployment,
            messages=st.session_state.messages,
            temperature=0.7,
            stream=True,
        )
        reply = st.write_stream(
            chunk.choices[0].delta.content or ""
            for chunk in stream
            if chunk.choices
        )

    st.session_state.messages.append({"role": "assistant", "content": reply})
