import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import SplitScreen from "../Login/SplitScreen";
import StrengthLine, { passwordOk } from "./StrengthLine";
import "./Join.css";

const roomNames = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

function Join() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  function toggleRoom(room) {
    setRooms(rooms.includes(room) ? rooms.filter((item) => item !== room) : [...rooms, room]);
  }

  function findProblem() {
    if (!name.trim()) {
      return "Please tell us your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "That email does not look right.";
    }
    if (!passwordOk(password)) {
      return "Use at least 8 characters, with a number or a symbol.";
    }
    if (password !== confirm) {
      return "The two passwords do not match.";
    }
    if (!agreed) {
      return "Please tick the box to agree to the terms.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const problem = findProblem();
    setErrorMessage(problem);
    if (problem) {
      return;
    }
    setSending(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, rooms });
      navigate("/verify-email", { state: { email: email.trim() } });
    } catch (error) {
      setErrorMessage(error.message);
      setSending(false);
    }
  }

  return (
    <SplitScreen topLink="/gallery" topText="Back to the gallery">
      <div className="form-steps">
        <p className="small-label">Free pass</p>
        <span className="form-step-count">Step 1 of 2</span>
      </div>
      <div className="form-progress">
        <span className="form-progress-done" style={{ width: "50%" }}></span>
      </div>
      <h1 className="page-title">Let's get you a pass.</h1>
      <p className="form-line">It takes a minute, and it's free.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <input type="text" className="line-input" placeholder="Your name" aria-label="Your name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="form-field">
          <input type="email" className="line-input" placeholder="Email" aria-label="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-field">
          <input type="password" className="line-input" placeholder="Password" aria-label="Password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <StrengthLine password={password} parts={4} />
        </div>
        <div className="form-field">
          <input type="password" className="line-input" placeholder="Confirm password" aria-label="Confirm password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </div>
        <p className="rooms-question">
          <strong>Which rooms do you like?</strong> Pick any, or skip this.
        </p>
        <div className="room-choices">
          {roomNames.map((room) => (
            <button key={room} type="button" className={"room-choice" + (rooms.includes(room) ? " room-choice-on" : "")} aria-pressed={rooms.includes(room)} onClick={() => toggleRoom(room)}>
              {room}
            </button>
          ))}
        </div>
        <label className="terms-line">
          <input type="checkbox" className="terms-box" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <span>
            I agree to the{" "}
            <Link to="/about" className="form-side-link">
              terms
            </Link>
          </span>
        </label>
        {errorMessage && <p className="error-text join-error">{errorMessage}</p>}
        <button type="submit" className="btn btn-dark form-button" disabled={sending}>
          {sending ? "One moment." : "Continue"}
        </button>
      </form>
      <p className="form-under">
        Already have a pass? <Link to="/login">Log in</Link>
      </p>
      <p className="form-note">We'll email you a short code to check it's really you.</p>
    </SplitScreen>
  );
}

export default Join;
