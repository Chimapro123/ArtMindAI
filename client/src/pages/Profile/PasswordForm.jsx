import { useState } from "react";
import { updatePassword } from "../../services/api";
import StrengthLine, { passwordOk } from "../Join/StrengthLine";
import "./PasswordForm.css";

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [fresh, setFresh] = useState("");
  const [again, setAgain] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setNote("");
    if (!current) {
      setErrorMessage("Type your current password first.");
      return;
    }
    if (!passwordOk(fresh)) {
      setErrorMessage("Use at least 8 characters, with a number or a symbol.");
      return;
    }
    if (fresh !== again) {
      setErrorMessage("The two new passwords do not match.");
      return;
    }
    setSaving(true);
    setErrorMessage("");
    try {
      const data = await updatePassword(current, fresh);
      setNote(data.message);
      setCurrent("");
      setFresh("");
      setAgain("");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSaving(false);
  }

  return (
    <form className="password-form" onSubmit={handleSubmit} noValidate>
      <label className="password-field">
        <span>Current password</span>
        <input type="password" className="line-input" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} />
      </label>
      <label className="password-field">
        <span>New password</span>
        <input type="password" className="line-input" autoComplete="new-password" value={fresh} onChange={(event) => setFresh(event.target.value)} />
      </label>
      <StrengthLine password={fresh} />
      <label className="password-field">
        <span>Type the new one again</span>
        <input type="password" className="line-input" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} />
      </label>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      {note && <p className="password-note">{note}</p>}
      <button type="submit" className="btn btn-light password-button" disabled={saving}>
        {saving ? "One moment." : "Update password"}
      </button>
    </form>
  );
}

export default PasswordForm;
