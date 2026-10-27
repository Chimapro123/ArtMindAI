import { useRef } from "react";
import Frame from "../../components/Frame";
import { ImageIcon } from "../../components/Icons";
import "./EditorPicture.css";

const fiveMb = 5 * 1024 * 1024;

function EditorPicture({ painting, busy, onPick }) {
  const inputRef = useRef(null);

  function handleFile(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > fiveMb) {
      return;
    }
    onPick(file);
  }

  return (
    <div className="editor-picture">
      {painting ? (
        <>
          <Frame image={painting.image} title={painting.title} artist={painting.artist} />
          <div className="picture-links">
            <button type="button" className="picture-link" disabled={busy !== ""} onClick={() => inputRef.current.click()}>
              {busy === "image" ? "Saving the image." : "Replace image"}
            </button>
            <span className="picture-note">{painting.status === "on-the-wall" ? "On the wall" : "In storage"}</span>
          </div>
        </>
      ) : (
        <button type="button" className="picture-empty" disabled={busy !== ""} onClick={() => inputRef.current.click()}>
          <ImageIcon size={36} />
          <span className="picture-empty-title">{busy === "image" ? "Making the painting." : "Choose an image"}</span>
          <span className="picture-empty-text">JPG or PNG, up to 5 MB. The painting goes into storage straight away, so you can label it and write its story.</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="picture-input" onChange={handleFile} />
    </div>
  );
}

export default EditorPicture;
