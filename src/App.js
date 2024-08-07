import axios from "axios";
import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const corsProxy = "https://cors-anywhere.herokuapp.com/";
  const apiUrl = "https://wsapi.simsimi.com/190410/talk";
  const apiKey = "u4LxwtXO.kCcc5I9HPvIowvSFyYGU-jQw7IkMR4G";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", text: message },
    ]);

    try {
      const response = await axios.post(
        corsProxy + apiUrl,
        {
          utext: message,
          lang: "ko",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
        }
      );

      const { atext } = response.data;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "bot", text: atext },
      ]);
    } catch (error) {
      console.error(
        "Error fetching response:",
        error.response ? error.response.data : error.message
      );
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "bot", text: "Failed to get a response." },
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>심심이</h1>
      <div>
        <div style={{ marginBottom: "10px" }}>
          <input
            required
            placeholder="하고 싶은 말을 입력하세요!"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ padding: "10px", width: "80%", borderRadius: "10px" }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "10px",
              marginLeft: "10px",
              border: "none",
              backgroundColor: "yellow",
              borderRadius: "10px",
            }}
          >
            {loading ? "로딩 중..." : "전송"}
          </button>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            height: "400px",
            overflowY: "scroll",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              style={{
                textAlign: chat.sender === "user" ? "right" : "left",
                padding: "0 5px",
                margin: "5px",
                backgroundColor: chat.sender === "user" ? "yellow" : "#ffffff",
                borderRadius: "10px",
                maxWidth: "70%",
                alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                wordWrap: "break-word",
              }}
            >
              <p>{chat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
