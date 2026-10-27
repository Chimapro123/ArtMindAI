import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deleteProfile } from "../../services/api";
import "./ClosePass.css";

function ClosePass() {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [asking, setAsking] = useState(false);
  const [typed, setTyped] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [closing, setClosing] = useState(false);

  async function closeIt(event) {
    event.preventDefault();
    if (typed !== "CLOSE") {
      return;
    }
    setClosing(true);
    setErrorMessage("");
    try {
      await deleteProfile();
      await logOut();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
      setClosing(false);
    }
  }

  return (
    <div className="close-pass">
      <h2 className="close-heading">If you leave, we'll delete your saved paintings, your collections and your history for good.</h2>
      {!asking && (
        <button type="button" className="close-link" onClick={() => setAsking(true)}>
          Close my pass
        </button>
      )}
      {asking && (
        <form className="close-confirm" onSubmit={closeIt}>
          <label className="close-field">
            <span>Type CLOSE to go ahead.</span>
            <input type="text" className="line-input" value={typed} autoComplete="off" onChange={(event) => setTyped(event.target.value.toUpperCase())} />
          </label>
          <div className="close-buttons">
            <button type="submit" className="btn btn-light close-button" disabled={typed !== "CLOSE" || closing}>
              {closing ? "Closing." : "Close it for good"}
            </button>
            <button type="button" className="close-link" onClick={() => { setAsking(false); setTyped(""); }}>
              I'll stay
            </button>
          </div>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default ClosePass;
