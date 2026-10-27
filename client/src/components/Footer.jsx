import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "../services/api";
import { ArrowIcon } from "./Icons";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubscribe(event) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSending(true);
    setMessage("");
    try {
      await subscribeToNewsletter(email.trim());
      setMessage("Thank you. See you on Sunday.");
      setEmail("");
    } catch (error) {
      setMessage(error.message);
    }
    setSending(false);
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Link to="/" className="big-logo">
            ArtMind
          </Link>
          <div className="footer-columns">
            <div className="footer-column">
              <h4 className="footer-heading">Visit</h4>
              <Link to="/gallery">Gallery</Link>
              <Link to="/gallery">Rooms</Link>
              <Link to="/artists">Artists</Link>
              <Link to="/collections">Collections</Link>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Tools</h4>
              <Link to="/search">Search</Link>
              <Link to="/image-lab">Image Lab</Link>
              <Link to="/guide">Guide</Link>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">You</h4>
              <Link to="/login">Log in</Link>
              <Link to="/join">Join</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">About</h4>
              <Link to="/about">About ArtMind</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/about">Image credits</Link>
            </div>
          </div>
        </div>
        <form className="newsletter" onSubmit={handleSubscribe}>
          <p className="newsletter-text">Letters from the gallery, one painting in your inbox every Sunday.</p>
          <div className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email address"
              aria-label="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" className="text-link" disabled={sending}>
              Subscribe <ArrowIcon size={16} />
            </button>
          </div>
          {message && <p className="newsletter-message">{message}</p>}
        </form>
        <div className="footer-bottom">
          <p>Built by Chiboy, Goodluck, Luwa, Miles, Treasure and Noble.</p>
          <p>Every painting here is in the public domain.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
