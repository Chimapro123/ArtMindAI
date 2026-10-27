import { useState, useEffect, useRef } from "react";
import { rotatePhoto, cropPhoto } from "./photoHelpers";
import "./PhotoTools.css";

function PhotoTools({ photo, sending, onChange, onReset }) {
  const [preview, setPreview] = useState("");
  const [cropping, setCropping] = useState(false);
  const [box, setBox] = useState(null);
  const pictureRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function pointIn(event) {
    const rect = pictureRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }

  function startBox(event) {
    if (!cropping) {
      return;
    }
    event.preventDefault();
    startRef.current = pointIn(event);
    setBox({ left: startRef.current.x, top: startRef.current.y, width: 0, height: 0 });
  }

  function moveBox(event) {
    if (!cropping || !startRef.current) {
      return;
    }
    const point = pointIn(event);
    setBox({
      left: Math.min(startRef.current.x, point.x),
      top: Math.min(startRef.current.y, point.y),
      width: Math.abs(point.x - startRef.current.x),
      height: Math.abs(point.y - startRef.current.y)
    });
  }

  function endBox() {
    startRef.current = null;
  }

  async function applyCrop() {
    if (box && box.width > 2 && box.height > 2) {
      onChange(await cropPhoto(photo, box));
    }
    setCropping(false);
    setBox(null);
  }

  async function rotate() {
    onChange(await rotatePhoto(photo));
  }

  return (
    <div className="photo-tools">
      <div
        ref={pictureRef}
        className={"photo-picture" + (cropping ? " photo-cropping" : "")}
        onPointerDown={startBox}
        onPointerMove={moveBox}
        onPointerUp={endBox}
        onPointerLeave={endBox}
      >
        {preview && <img src={preview} alt="Your photo" draggable="false" />}
        {sending && <span className="scan-line"></span>}
        {cropping && box && (
          <span className="crop-box" style={{ left: box.left + "%", top: box.top + "%", width: box.width + "%", height: box.height + "%" }}></span>
        )}
      </div>
      {cropping ? (
        <div className="photo-buttons">
          <p className="photo-hint">Drag a box over the part you want to keep.</p>
          <button type="button" className="photo-button" onClick={applyCrop}>
            Use this crop
          </button>
          <button type="button" className="photo-button" onClick={() => { setCropping(false); setBox(null); }}>
            Never mind
          </button>
        </div>
      ) : (
        <div className="photo-buttons">
          <button type="button" className="photo-button" onClick={() => setCropping(true)} disabled={sending}>
            Crop
          </button>
          <button type="button" className="photo-button" onClick={rotate} disabled={sending}>
            Rotate
          </button>
          <button type="button" className="photo-button" onClick={onReset} disabled={sending}>
            Try another photo
          </button>
        </div>
      )}
      <p className="photo-note">JPG or PNG, up to 5 MB.</p>
    </div>
  );
}

export default PhotoTools;
