import React, { useState } from "react";

const styles = {
  app: { fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "40px auto", padding: "0 20px" },
  title: { textAlign: "center", color: "#333" },
  chatBox: {
    border: "1px solid #ddd", borderRadius: 8, padding: 16,
    height: 400, overflowY: "auto", background: "#f9f9f9", marginBottom: 16,
  },
  message: { marginBottom: 12, display: "flex", flexDirection: "column" },
  userBubble: {
    alignSelf: "flex-end", background: "#0070f3", color: "#fff",
    padding: "8px 14px", borderRadius: 16, maxWidth: "70%",
  },
  aiBubble: {
    alignSelf: "flex-start", background: "#e8e8e8", color: "#333",
    padding: "8px 14px", borderRadius: 16, maxWidth: "70%",
  },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 14 },
  button: {
    padding: "10px 20px", background: "#0070f3", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
  },
  label: { fontSize: 11, color: "#999", marginBottom: 2 },
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Error: Could not reach the server." }]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={styles.app}>
      <h2 style={styles.title}>Claude AI Chat</h2>
      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: 160 }}>
            Ask Claude anything...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            <span style={styles.label}>{msg.role === "user" ? "You" : "Claude"}</span>
            <span style={msg.role === "user" ? styles.userBubble : styles.aiBubble}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div style={styles.message}>
            <span style={styles.label}>Claude</span>
            <span style={styles.aiBubble}>Thinking...</span>
          </div>
        )}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message and press Enter..."
        />
        <button style={styles.button} onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
