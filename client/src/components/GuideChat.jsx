import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GuideContext } from "../context/GuideContext";
import { askGuide, getPainting } from "../services/api";
import { CloseIcon, ExpandIcon, SendIcon } from "./Icons";
import GuideMessage from "./GuideMessage";
import "./GuideChat.css";

const suggestions = ["What should I see first?", "Tell me about this painting.", "Something calm."];
const restingMessage = "The guide is resting right now. Try again in a moment.";

function GuideChat({ onClose }) {
  const { user } = useContext(AuthContext);
  const { paintingSlug, paintingTitle, setPaintingTitle, clearPainting } = useContext(GuideContext);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, thinking]);

  useEffect(() => {
    async function loadTitle() {
      try {
        const data = await getPainting(paintingSlug);
        setPaintingTitle(data.painting.title);
      } catch (error) {
        setPaintingTitle(paintingSlug);
      }
    }
    if (paintingSlug && !paintingTitle) {
      loadTitle();
    }
  }, [paintingSlug, paintingTitle, setPaintingTitle]);

  async function sendQuestion(text) {
    const trimmed = text.trim();
    if (!trimmed || thinking) {
      return;
    }
    setMessages((oldMessages) => [...oldMessages, { from: "visitor", text: trimmed }]);
    setQuestion("");
    setThinking(true);
    try {
      const data = await askGuide(trimmed, conversationId, paintingSlug);
      setConversationId(data.conversationId);
      setMessages((oldMessages) => [...oldMessages, { from: "guide", text: data.answer, paintings: data.paintings || [] }]);
    } catch (error) {
      setMessages((oldMessages) => [...oldMessages, { from: "guide", text: restingMessage }]);
    }
    setThinking(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion(question);
  }

  return (
    <div className="chat-box" role="dialog" aria-label="The guide">
      <div className="chat-header">
        <div>
          <h3 className="chat-title">The guide</h3>
          <p className="chat-subtitle">Usually answers in a few seconds.</p>
        </div>
        <div className="chat-header-buttons">
          <Link to="/guide" className="icon-button" aria-label="Open the full guide" onClick={onClose}>
            <ExpandIcon size={18} />
          </Link>
          <button type="button" className="icon-button" aria-label="Close the guide" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>
      </div>
      {paintingSlug && (
        <div className="chat-about">
          <span>
            Talking about: <strong>{paintingTitle || "..."}</strong>
          </span>
          <button type="button" className="chat-about-clear" aria-label="Stop talking about this painting" onClick={clearPainting}>
            <CloseIcon size={14} />
          </button>
        </div>
      )}
      <div className="chat-messages">
        <p className="chat-greeting">Hello, I'm the guide. Ask me about any painting, artist or style in the gallery.</p>
        {user ? (
          <div className="chat-suggestions">
            {suggestions.map((text) => (
              <button key={text} type="button" className="tag" onClick={() => sendQuestion(text)}>
                {text}
              </button>
            ))}
          </div>
        ) : (
          <div className="chat-login">
            <p>Log in and I'll help you find your way around.</p>
            <Link to="/login" className="btn btn-light chat-login-button" onClick={onClose}>
              Log in
            </Link>
            <Link to="/join" className="text-link chat-login-link" onClick={onClose}>
              Get your free pass
            </Link>
          </div>
        )}
        {messages.map((message, index) => (
          <GuideMessage key={index} message={message} />
        ))}
        {thinking && (
          <div className="typing-dots" aria-label="The guide is typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about a painting."
          aria-label="Ask about a painting"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={!user}
        />
        <button type="submit" className="send-button" aria-label="Send" disabled={!user || thinking}>
          <SendIcon size={18} />
        </button>
      </form>
      <p className="chat-note">The guide only talks about paintings in this gallery.</p>
    </div>
  );
}

export default GuideChat;
