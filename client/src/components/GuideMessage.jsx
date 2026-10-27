import { Link } from "react-router-dom";
import Frame from "./Frame";
import { ArrowIcon } from "./Icons";
import "./GuideMessage.css";

function GuideMessage({ message }) {
  if (message.from === "visitor") {
    return <div className="message message-visitor">{message.text}</div>;
  }

  return (
    <div className="message message-guide">
      <p>{message.text}</p>
      {message.paintings &&
        message.paintings.map((painting) => (
          <div className="message-painting" key={painting.slug}>
            <Frame image={painting.thumb} title={painting.title} artist={painting.artist} className="message-frame" />
            <div>
              <p className="message-painting-title">{painting.title}</p>
              <p className="message-painting-artist">
                {painting.artist}, {painting.year}
              </p>
              <Link to={"/painting/" + painting.slug} className="text-link message-painting-link">
                Open painting <ArrowIcon size={14} />
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default GuideMessage;
