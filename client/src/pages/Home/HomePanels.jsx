import { Link } from "react-router-dom";
import { ArrowIcon } from "../../components/Icons";
import "./HomePanels.css";

function HomePanels({ onAsk }) {
  return (
    <section className="dark-section home-panels">
      <div className="container panels-inner">
        <div className="panel">
          <p className="small-label">The guide</p>
          <h2 className="panel-title">Ask anything, even the silly questions.</h2>
          <div className="panel-chat">
            <p className="panel-who">Visitor</p>
            <p className="panel-bubble panel-bubble-visitor">Why does everyone in The Night Watch look like they're moving?</p>
            <p className="panel-who">Guide</p>
            <p className="panel-bubble">Rembrandt painted the company setting off to march, not posing, so he caught them mid step.</p>
          </div>
          <button type="button" className="text-link" onClick={onAsk}>
            Ask the guide <ArrowIcon size={16} />
          </button>
        </div>
        <div className="panel panel-second">
          <p className="small-label">Image Lab</p>
          <h2 className="panel-title">Saw a painting you can't name?</h2>
          <p className="panel-text">Show us a photo. We'll tell you its likely style and colours, and which paintings here are closest to it.</p>
          <Link to="/image-lab" className="text-link">
            Upload a photo <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePanels;
