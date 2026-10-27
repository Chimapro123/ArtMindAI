import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword, checkResetCode, resetPassword } from "../../services/api";
import SplitScreen from "../Login/SplitScreen";
import CodeBoxes from "../VerifyEmail/CodeBoxes";
import StrengthLine, { passwordOk } from "../Join/StrengthLine";
import ResetStep from "./ResetStep";
import "./ResetPassword.css";

function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);

  async function sendCode(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("That email does not look right.");
      return;
    }
    setSending(true);
    try {
      await forgotPassword(email.trim());
      setStep(2);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  async function checkCode(event) {
    event.preventDefault();
    setErrorMessage("");
    if (code.length !== 6) {
      setErrorMessage("Please type all six digits.");
      return;
    }
    setSending(true);
    try {
      await checkResetCode(email.trim(), code);
      setStep(3);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  async function savePassword(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!passwordOk(password)) {
      setErrorMessage("Use at least 8 characters, with a number or a symbol.");
      return;
    }
    if (password !== again) {
      setErrorMessage("The two passwords do not match.");
      return;
    }
    setSending(true);
    try {
      await resetPassword(email.trim(), code, password);
      setFinished(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSending(false);
  }

  function changeEmail() {
    setStep(1);
    setCode("");
    setErrorMessage("");
  }

  return (
    <SplitScreen topLink="/login" topText="Back to log in">
      <p className="small-label">Reset password</p>
      <div className="reset-line"></div>
      <h1 className="page-title">Let's get you back in.</h1>
      <p className="form-line">It happens to everyone. Three quick steps.</p>
      <ResetStep
        number={1}
        title="Your email."
        open={step === 1}
        done={step > 1}
        summary={
          <>
            <span>{email}</span>
            <button type="button" className="form-side-link reset-change" onClick={changeEmail}>
              Change
            </button>
          </>
        }
      >
        <form onSubmit={sendCode} noValidate>
          <input type="email" className="line-input" placeholder="Email" aria-label="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {step === 1 && errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit" className="btn btn-dark form-button reset-button" disabled={sending}>
            {sending ? "One moment." : "Send me a code"}
          </button>
        </form>
      </ResetStep>
      <ResetStep number={2} title="The code we sent." open={step === 2} done={step > 2} summary={<span>Code confirmed</span>}>
        <form onSubmit={checkCode} noValidate>
          <CodeBoxes code={code} onChange={setCode} />
          <p className="reset-hint">We've sent a six digit code to {email}. It works for 10 minutes.</p>
          {step === 2 && errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit" className="btn btn-dark form-button reset-button" disabled={sending}>
            {sending ? "One moment." : "Check the code"}
          </button>
        </form>
      </ResetStep>
      <ResetStep number={3} title="A new password." open={step === 3} done={finished} last summary={<span>Your password is changed.</span>}>
        <form onSubmit={savePassword} noValidate>
          <div className="form-field">
            <label className="form-field-label" htmlFor="reset-password">
              New password
            </label>
            <input id="reset-password" type="password" className="line-input" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <StrengthLine password={password} parts={3} />
          </div>
          <div className="form-field">
            <label className="form-field-label" htmlFor="reset-again">
              Type it again
            </label>
            <input id="reset-again" type="password" className="line-input" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} />
          </div>
          {step === 3 && errorMessage && <p className="error-text">{errorMessage}</p>}
          <button type="submit" className="btn btn-dark form-button" disabled={sending}>
            {sending ? "One moment." : "Save new password"}
          </button>
        </form>
      </ResetStep>
      {finished && (
        <p className="form-under reset-done">
          All done. <Link to="/login">Log in with your new password</Link>
        </p>
      )}
    </SplitScreen>
  );
}

export default ResetPassword;
