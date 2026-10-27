import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { sendMessage, getPainting } from "../../services/api";
import Frame from "../../components/Frame";
import Faq from "./Faq";
import "./Contact.css";

const subjects = ["A mistake on a painting's page", "An idea for a collection", "Something isn't working", "Just saying hello"];

function Contact() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState("");
  const [sendCopy, setSendCopy] = useState(false);
  const [sending, setSending] = useState(false);
  const [thanks, setThanks] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cover, setCover] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    getPainting("man-writing-a-letter")
      .then((data) => setCover(data.painting))
      .catch(() => setCover(null));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill in your name, your email and a message.");
      return;
    }
    setSending(true);
    try {
      const data = await sendMessage({ name: name.trim(), email: email.trim(), subject, message: message.trim(), sendCopy });
      setThanks(data.message || "Thanks, we've got your message.");
      setMessage("");
      setSendCopy(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  return (
    <>
      <section className="dark-section contact-top">
        <div className="container contact-top-inner">
          <div>
            <p className="small-label">Contact</p>
            <h1 className="page-title">We read every message.</h1>
            <p className="contact-line">Spotted a mistake on a painting's page, have an idea for a collection, or just want to say hello? Drop us a note.</p>
          </div>
          {cover && (
            <div className="contact-cover">
              <div className="contact-glow"></div>
              <Link to={"/painting/" + cover.slug} className="contact-cover-frame">
                <Frame image={cover.image} title={cover.title} artist={cover.artist} />
              </Link>
              <div className="contact-cover-label">
                <p className="small-label">{cover.artist}</p>
                <p className="contact-cover-title">{cover.title}</p>
                <p className="contact-cover-year">{cover.year}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="stone-section">
        <div className="container contact-inner">
          <div className="contact-aside">
            <p className="small-label">Email</p>
            <p className="contact-email">hello@artmind.example</p>
            <p className="contact-aside-text">We usually write back within a day or two.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label className="contact-field">
              <span>Your name</span>
              <input type="text" className="line-input" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="contact-field">
              <span>Your email</span>
              <input type="email" className="line-input" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="contact-field">
              <span>What's it about?</span>
              <select className="contact-select" value={subject} onChange={(event) => setSubject(event.target.value)}>
                {subjects.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </label>
            <p className="contact-choices">{subjects.join("  ·  ")}</p>
            <label className="contact-field">
              <span>Your message</span>
              <textarea className="contact-textarea" rows="6" value={message} onChange={(event) => setMessage(event.target.value)} />
            </label>
            <label className="contact-copy">
              <input type="checkbox" checked={sendCopy} onChange={(event) => setSendCopy(event.target.checked)} />
              <span>Send me a copy</span>
            </label>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            {thanks && <p className="contact-thanks">{thanks}</p>}
            <button type="submit" className="contact-send" disabled={sending}>
              {sending ? "Sending." : "Send message"}
            </button>
          </form>
        </div>
      </section>
      <Faq />
    </>
  );
}

export default Contact;
