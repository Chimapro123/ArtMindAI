import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { askGuide, getConversations, getConversation, getPainting } from "../../services/api";
import ConversationList from "./ConversationList";
import GuideMessages from "./GuideMessages";
import GuideComposer from "./GuideComposer";
import "./Guide.css";

const restingMessage = "The guide is resting right now. Try again in a moment.";

function Guide() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paintingSlug = searchParams.get("painting") || "";
  const [paintingTitle, setPaintingTitle] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  async function loadList() {
    try {
      const data = await getConversations();
      setConversations(data.items);
    } catch (error) {
      setConversations([]);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (!paintingSlug) {
      setPaintingTitle("");
      return;
    }
    getPainting(paintingSlug)
      .then((data) => setPaintingTitle(data.painting.title))
      .catch(() => setPaintingTitle(paintingSlug));
  }, [paintingSlug]);

  async function openConversation(id) {
    setActiveId(id);
    setListOpen(false);
    try {
      const data = await getConversation(id);
      setMessages(data.conversation.messages);
    } catch (error) {
      setMessages([{ from: "guide", text: error.message, paintings: [] }]);
    }
  }

  function startNew() {
    setActiveId(null);
    setMessages([]);
    setListOpen(false);
  }

  async function send(text) {
    const question = text.trim();
    if (!question || thinking) {
      return;
    }
    setMessages((old) => [...old, { from: "visitor", text: question, paintings: [] }]);
    setThinking(true);
    try {
      const data = await askGuide(question, activeId, paintingSlug || null);
      setMessages((old) => [...old, { from: "guide", text: data.answer, paintings: data.paintings || [] }]);
      setActiveId(data.conversationId);
      loadList();
    } catch (error) {
      setMessages((old) => [...old, { from: "guide", text: restingMessage, paintings: [] }]);
    }
    setThinking(false);
  }

  function clearPainting() {
    const next = new URLSearchParams(searchParams);
    next.delete("painting");
    setSearchParams(next);
  }

  return (
    <div className="guide-page">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onPick={openConversation}
        onNew={startNew}
        open={listOpen}
        onToggle={() => setListOpen(!listOpen)}
      />
      <section className="guide-main">
        <div className="guide-head">
          <p className="small-label">The guide</p>
          <h1 className="guide-title">Ask me anything about the paintings here.</h1>
          <p className="guide-line">I know every painting in this gallery. If I'm not sure about something, I'll tell you.</p>
        </div>
        <GuideMessages messages={messages} thinking={thinking} />
        <GuideComposer
          onSend={send}
          thinking={thinking}
          paintingTitle={paintingTitle}
          hasPainting={Boolean(paintingSlug)}
          onClearPainting={clearPainting}
        />
      </section>
    </div>
  );
}

export default Guide;
