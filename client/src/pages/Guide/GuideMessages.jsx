import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Frame from "../../components/Frame";
import { ArrowIcon } from "../../components/Icons";
import "./GuideMessages.css";

function ReplyPaintings({ paintings }) {
  if (!paintings || paintings.length === 0) {
    return null;
  }
  return (
    <div className="reply-paintings">
      {paintings.map((painting) => (
        <div key={painting.slug} className="reply-painting">
          <Link to={"/painting/" + painting.slug} className="reply-frame">
            <Frame image={painting.thumb} title={painting.title} artist={painting.artist} />
          </Link>
          <p className="reply-painting-title">{painting.title}</p>
          <p className="reply-painting-artist">
            {painting.artist}, {painting.year}
          </p>
          <Link to={"/painting/" + painting.slug} className="text-link reply-open">
            Open painting <ArrowIcon size={14} />
          </Link>
        </div>
      ))}
    </div>
  );
}

function GuideMessages({ messages, thinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && (messages.length > 0 || thinking)) {
      bottomRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, thinking]);

  return (
    <div className="guide-messages">
      {messages.map((message, index) =>
        message.from === "visitor" ? (
          <div key={index} className="guide-visitor">
            {message.text}
          </div>
        ) : (
          <div key={index} className="guide-reply">
            <p className="guide-reply-text">{message.text}</p>
            <ReplyPaintings paintings={message.paintings} />
          </div>
        )
      )}
      {thinking && (
        <div className="guide-typing" aria-label="The guide is typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default GuideMessages;
