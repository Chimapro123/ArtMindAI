import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logIn } from "../../services/api";
import SplitScreen from "./SplitScreen";
import "./Login.css";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password) {
      setErrorMessage("Please type your email and password.");
      return;
    }
    setSending(true);
    try {
      const data = await logIn(email.trim(), password);
      setUser(data.user);
      const from = location.state && location.state.from;
      navigate(from || "/dashboard", { replace: true });
    } catch (error) {
      if (error.message === "Please confirm your email first") {
        navigate("/verify-email", { state: { email: email.trim() } });
        return;
      }
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  return (
    <SplitScreen topLink="/gallery" topText="Back to the gallery">
      <p className="small-label">Log in</p>
      <h1 className="page-title">Good to see you again.</h1>
      <p className="form-line">Log in to pick up where you left off.</p>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="line-input"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-field-label" htmlFor="login-password">
            Password
          </label>
          <div className="form-field-row">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="line-input"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" className="show-button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="form-side">
          <Link to="/reset-password" className="form-side-link">
            Forgot your password?
          </Link>
        </div>
        {errorMessage && <p className="error-text login-error">{errorMessage}</p>}
        <button type="submit" className="btn btn-dark form-button" disabled={sending}>
          {sending ? "One moment." : "Log in"}
        </button>
      </form>
      <p className="form-under">
        New here? <Link to="/join">Get your free pass</Link>
      </p>
      <p className="form-note">Free to use, and your favourites stay private.</p>
    </SplitScreen>
  );
}

export default Login;
