import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaAssistiveListeningSystems, FaComment } from "react-icons/fa";
import "./KisarChatbot.css";
import { API_ROUTES } from "../app modules/apiRoutes";
import DOMPurify from "dompurify";

const formatContent = (content) => {
  // Format code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  // Format large headers
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");

  // Format bold text
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Format italic text
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Format list items
  content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
  content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");

  // Format tables
  content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
    const rows = match.split("\n").filter((row) => row.trim());
    const tableRows = rows
      .map((row, index) => {
        const cells = row.split("|").filter((cell) => cell.trim());
        if (index === 0) {
          return `<tr>${cells.map((cell) => `<th>${cell.trim()}</th>`).join("")}</tr>`;
        }
        return `<tr>${cells.map((cell) => `<td>${cell.trim()}</td>`).join("")}</tr>`;
      })
      .join("");
    return `<table>${tableRows}</table>`;
  });

  // Format LaTeX/math expressions
  content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`);

  // Ensure all remaining asterisks are removed
  content = content.replace(/\*/g, "");

  return content;
};

function KisarChatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chatHistory, setChatHistory] = useState(
    JSON.parse(localStorage.getItem("kisar_chat")) || [
      { role: "model", parts: [{ text: "Hey there! How can I assist you today?" }] },
    ]
  );
  const chatRef = useRef(null);

  // Detect screen size dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Store chat history in local storage
  useEffect(() => {
    localStorage.setItem("kisar_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Scroll to the latest message when chat updates
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 200);
    }
  }, [chatHistory, chatOpen]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { role: "user", parts: [{ text: message }] };
    const updatedHistory = [...chatHistory, newMessage];

    setChatHistory(updatedHistory);
    setLoading(true);
    setMessage("");

    try {
      // Ensure the first message in history is from the user before sending to API
      const validChatHistory = updatedHistory.filter(
        (msg) => msg.role === "user" || msg.role === "model"
      );
      if (validChatHistory[0]?.role !== "user") {
        validChatHistory.unshift({ role: "user", parts: [{ text: "Hello!" }] }); // Default user start
      }

      const response = await axios.post(API_ROUTES.aiChat, {
        message,
        chatHistory: validChatHistory,
      });

      setChatHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: response.data.response }] },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: "Something went wrong. Try again!" }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const SparkleIcon = () => (
    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
</svg>

);

  return (
    <>
      {/* Chat Icon (Only shown when chat is closed) */}
      {!chatOpen && (
  <div 
    className="chatbot-icon" 
    onClick={() => setChatOpen(true)}
    aria-label="Open Chat"
  >
    <SparkleIcon/>
  </div>
)}


{chatOpen && (
  <div className={`chatbot-window ${isMobile ? "mobile-chatbot" : ""}`}>
    <div className="chatbot-header">
      <span style={{textAlign: 'center'}}>AI Chatbot (Kisar)</span>
      <button onClick={() => setChatOpen(false)}>✖</button>
    </div>

    <div className="chatbot-messages" ref={chatRef}>
      {chatHistory.map((msg, index) => (
        <div
          key={index}
          className={msg.role === "user" ? "user-message" : "ai-message"}
          dangerouslySetInnerHTML={{
            __html: msg.role === "model" 
              ? DOMPurify.sanitize(formatContent(msg.parts[0].text))
              : msg.parts[0].text,
          }}
        />
      ))}
      {loading && <div className="ai-message">Typing...</div>}
    </div>

    <div className="chatbot-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        autoFocus
      />
      <button onClick={sendMessage} className="send-btn">
        ➤
      </button>
    </div>

    {/* Footer */}
<div className="chatbot-footer">
  Powered by{" "}
  <strong>
    <a
      href="https://edusify-download.vercel.app/"
      style={{
        textDecoration: "none",
        color: "#0078ff", // Set the text color instead of background
        fontWeight: "bold",
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      Edusify
    </a>
  </strong>
</div>

  </div>
)}

    </>
  );
}

export default KisarChatbot;
