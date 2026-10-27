import { useState, useRef } from "react";
import { ImageIcon } from "../../components/Icons";
import "./DropZone.css";

const fiveMb = 5 * 1024 * 1024;

export function checkFile(file) {
  if (!file) {
    return "Please choose a photo.";
  }
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return "Please choose a JPG or PNG photo.";
  }
  if (file.size > fiveMb) {
    return "That photo is too big. Keep it under 5 MB.";
  }
  return "";
}

function DropZone({ onPick, onError }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  function takeFile(file) {
    const problem = checkFile(file);
    if (problem) {
      onError(problem);
      return;
    }
    onPick(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setOver(false);
    takeFile(event.dataTransfer.files[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setOver(true);
  }

  return (
    <div
      className={"drop-zone" + (over ? " drop-zone-over" : "")}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setOver(false)}
      onClick={() => inputRef.current.click()}
      onKeyDown={(event) => event.key === "Enter" && inputRef.current.click()}
      role="button"
      tabIndex="0"
      aria-label="Drop a photo here or choose one"
    >
      <ImageIcon size={36} />
      <p className="drop-title">Drop a photo here</p>
      <p className="drop-text">or click to choose one from your device.</p>
      <p className="drop-note">JPG or PNG, up to 5 MB.</p>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="drop-input" onChange={(event) => takeFile(event.target.files[0])} />
    </div>
  );
}

export default DropZone;
