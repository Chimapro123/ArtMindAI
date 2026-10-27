import { useState } from "react";
import { updateEmailSettings } from "../../services/api";
import "./EmailSwitches.css";

function EmailSwitches({ user, onUpdate }) {
  const [errorMessage, setErrorMessage] = useState("");
  const emails = user.emails || { newsletter: false, newCollections: false };

  async function change(key, value) {
    setErrorMessage("");
    try {
      const data = await updateEmailSettings({ ...emails, [key]: value });
      onUpdate(data.user);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="email-switches">
      <label className="email-row">
        <span>Letters from the gallery, one painting every Sunday.</span>
        <input type="checkbox" className="email-switch" checked={emails.newsletter} onChange={(event) => change("newsletter", event.target.checked)} />
      </label>
      <label className="email-row">
        <span>Tell me when a new collection is made for me.</span>
        <input type="checkbox" className="email-switch" checked={emails.newCollections} onChange={(event) => change("newCollections", event.target.checked)} />
      </label>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
    </div>
  );
}

export default EmailSwitches;
