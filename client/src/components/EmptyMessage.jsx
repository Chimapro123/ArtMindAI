import "./EmptyMessage.css";

function EmptyMessage({ title, text, children }) {
  return (
    <div className="empty-message">
      <p className="empty-title">{title}</p>
      {text && <p className="empty-text">{text}</p>}
      {children && <div className="empty-action">{children}</div>}
    </div>
  );
}

export default EmptyMessage;
