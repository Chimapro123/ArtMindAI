import { ChevronIcon } from "../../components/Icons";
import "./ConversationList.css";

function ConversationList({ conversations, activeId, onPick, onNew, open, onToggle }) {
  const listClass = "conversation-list" + (open ? " conversation-list-open" : "");

  return (
    <aside className="conversation-side">
      <div className="conversation-top">
        <button type="button" className="btn btn-light new-conversation" onClick={onNew}>
          New conversation
        </button>
        <button type="button" className="conversation-toggle" aria-expanded={open} onClick={onToggle}>
          Your conversations
          <ChevronIcon size={16} />
        </button>
      </div>
      <div className={listClass}>
        <p className="small-label conversation-label">Your conversations</p>
        {conversations.length === 0 && <p className="conversation-empty">Nothing yet. Ask the guide something and it will be kept here.</p>}
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                className={"conversation-link" + (conversation.id === activeId ? " conversation-link-active" : "")}
                onClick={() => onPick(conversation.id)}
              >
                {conversation.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default ConversationList;
