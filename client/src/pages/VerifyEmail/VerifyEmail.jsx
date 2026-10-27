import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { verifyEmail, resendCode } from "../../services/api";
import SplitScreen from "../Login/SplitScreen";
import CodeBoxes from "./CodeBoxes";
import "./VerifyEmail.css";

const waitSeconds = 60;

function formatWait(seconds) {
  return "0:" + String(seconds).padStart(2, "0");
}

function VerifyEmail() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const startEmail = (location.state && location.state.email) || params.get("email") || "";
  const [email, setEmail] = useState(startEmail);
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(waitSeconds);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    if (code.length !== 6) {
      setErrorMessage("Please type all six digits.");
      return;
    }
    setSending(true);
    try {
      const data = await verifyEmail(email.trim(), code);
      setUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      setSending(false);
    }
  }

  async function handleResend() {
    setErrorMessage("");
    setMessage("");
    try {
      const data = await resendCode(email.trim());
      setMessage(data.message);
      setSeconds(waitSeconds);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <SplitScreen topLink="/gallery" topText="Back to the gallery">
      <div className="form-steps">
        <p className="small-label">Free pass</p>
        <span className="form-step-count">Step 2 of 2</span>
      </div>
      <div className="form-progress">
        <span className="form-progress-done" style={{ width: "100%" }}></span>
      </div>
      <h1 className="page-title">Check your inbox.</h1>
      <p className="form-line">
        We've sent a six digit code to {email || "your email"}.
        <br />
        Type it in below.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        {!startEmail && (
          <div className="form-field">
            <input type="email" className="line-input" placeholder="Email" aria-label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
        )}
        <CodeBoxes code={code} onChange={setCode} />
        <p className="verify-hint">The code works for 10 minutes.</p>
        {errorMessage && <p className="error-text verify-error">{errorMessage}</p>}
        {message && <p className="verify-message">{message}</p>}
        <button type="submit" className="btn btn-dark form-button" disabled={sending}>
          {sending ? "One moment." : "Confirm my email"}
        </button>
      </form>
      <p className="verify-links">
        <span>Didn't get it?</span>{" "}
        {seconds > 0 ? (
          <span className="verify-wait">Send a new code in {formatWait(seconds)}.</span>
        ) : (
          <button type="button" className="form-side-link verify-resend" onClick={handleResend}>
            Send a new code.
          </button>
        )}
      </p>
      <p className="verify-links">
        <span>Wrong email?</span>{" "}
        <Link to="/join" className="form-side-link">
          Go back and change it.
        </Link>
      </p>
      <p className="form-note">Can't find it? Have a look in your spam folder.</p>
    </SplitScreen>
  );
}

export default VerifyEmail;
