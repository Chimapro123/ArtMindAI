import { useState, useRef } from "react";
import { getInitials } from "../../context/AuthContext";
import { updateProfile, uploadProfilePhoto } from "../../services/api";
import "./AboutYouForm.css";

const rooms = ["Abstract", "Landscape", "Flower", "Nature", "Figurative", "Religious"];

function AboutYouForm({ user, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about || "");
  const [picked, setPicked] = useState(user.rooms || []);
  const [preview, setPreview] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  function toggleRoom(room) {
    setPicked(picked.includes(room) ? picked.filter((item) => item !== room) : [...picked, room]);
  }

  async function changePhoto(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setErrorMessage("Please choose a JPG or PNG under 5 MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setErrorMessage("");
    try {
      const data = await uploadProfilePhoto(file);
      onUpdate(data.user);
      setNote("Photo changed.");
    } catch (error) {
      setErrorMessage(error.message);
      setPreview("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Your name cannot be empty.");
      return;
    }
    setSaving(true);
    setErrorMessage("");
    setNote("");
    try {
      const data = await updateProfile({ name: name.trim(), about: about.trim(), rooms: picked });
      onUpdate(data.user);
      setNote("Saved.");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSaving(false);
  }

  const photo = preview || user.photo;

  return (
    <form className="about-form" onSubmit={handleSubmit} noValidate>
      <div className="about-photo-column">
        <div className="about-photo">{photo ? <img src={photo} alt="Your photo" /> : <span>{getInitials(user.name)}</span>}</div>
        <button type="button" className="about-photo-link" onClick={() => inputRef.current.click()}>
          Change photo
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="about-photo-input" onChange={changePhoto} />
      </div>
      <div className="about-fields">
        <label className="about-field">
          <span>Name</span>
          <input type="text" className="line-input" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="about-field">
          <span>Email</span>
          <span className="about-email">
            <input type="email" className="line-input" value={user.email} readOnly />
            {user.emailConfirmed && <span className="about-confirmed">Confirmed</span>}
          </span>
        </label>
        <label className="about-field">
          <span>About you</span>
          <input type="text" className="line-input" maxLength="160" placeholder="A line about you, if you like." value={about} onChange={(event) => setAbout(event.target.value)} />
        </label>
        <p className="about-rooms-label">Rooms you like</p>
        <div className="about-rooms">
          {rooms.map((room) => (
            <button key={room} type="button" className={"about-room" + (picked.includes(room) ? " about-room-on" : "")} aria-pressed={picked.includes(room)} onClick={() => toggleRoom(room)}>
              {room}
            </button>
          ))}
        </div>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {note && <p className="about-note">{note}</p>}
        <button type="submit" className="btn btn-dark about-save" disabled={saving}>
          {saving ? "Saving." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default AboutYouForm;
