import { useState, useRef, useEffect } from "react";
import "./Frame.css";

const frameImages = import.meta.glob("../images/frame-gold.png", { eager: true, query: "?url", import: "default" });
const frameImage = Object.values(frameImages)[0];

function Frame({ image, title, artist, className }) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  const frameStyle = frameImage ? { borderImage: "url(" + frameImage + ") 48 round", borderWidth: "26px" } : undefined;
  const frameClass = "frame" + (className ? " " + className : "");
  const imageClass = "frame-image" + (loaded ? " frame-image-loaded" : "");

  return (
    <div className={frameClass} style={frameStyle}>
      <img
        ref={imageRef}
        src={image}
        alt={title + " by " + artist}
        loading="lazy"
        className={imageClass}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default Frame;
