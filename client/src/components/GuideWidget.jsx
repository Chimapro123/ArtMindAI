import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { GuideContext } from "../context/GuideContext";
import { ChatIcon } from "./Icons";
import GuideChat from "./GuideChat";
import "./GuideWidget.css";

function GuideWidget() {
  const { open, setOpen } = useContext(GuideContext);
  const location = useLocation();

  const hidden = location.pathname === "/guide" || location.pathname.startsWith("/admin");
  if (hidden) {
    return null;
  }

  const buttonClass = "chat-button" + (open ? " chat-button-open" : "");

  return (
    <div className="guide-widget">
      {open && <GuideChat onClose={() => setOpen(false)} />}
      <button
        type="button"
        className={buttonClass}
        aria-label={open ? "Close the guide" : "Ask the guide"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ChatIcon />
        <span className="chat-button-text">Ask the guide</span>
      </button>
    </div>
  );
}

export default GuideWidget;
