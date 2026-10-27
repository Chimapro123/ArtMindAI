import { useState, useEffect, useRef } from "react";
import { CloseIcon } from "../../components/Icons";
import "./ZoomView.css";

const smallest = 1;
const biggest = 6;

function clamp(value) {
  return Math.min(biggest, Math.max(smallest, value));
}

function distanceBetween(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function ZoomView({ painting, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function changeScale(next) {
    const value = clamp(next);
    setScale(value);
    if (value === smallest) {
      setOffset({ x: 0, y: 0 });
    }
  }

  function handleWheel(event) {
    changeScale(scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15));
  }

  function startDrag(event) {
    if (event.pointerType === "touch") {
      return;
    }
    dragRef.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    setDragging(true);
  }

  function moveDrag(event) {
    if (event.pointerType === "touch" || !dragRef.current) {
      return;
    }
    setOffset({ x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y });
  }

  function endDrag() {
    dragRef.current = null;
    pinchRef.current = null;
    setDragging(false);
  }

  function touchStart(event) {
    if (event.touches.length === 2) {
      pinchRef.current = { distance: distanceBetween(event.touches), scale };
    } else if (event.touches.length === 1) {
      dragRef.current = { x: event.touches[0].clientX - offset.x, y: event.touches[0].clientY - offset.y };
    }
  }

  function touchMove(event) {
    if (event.touches.length === 2 && pinchRef.current) {
      changeScale((pinchRef.current.scale * distanceBetween(event.touches)) / pinchRef.current.distance);
    } else if (event.touches.length === 1 && dragRef.current) {
      setOffset({ x: event.touches[0].clientX - dragRef.current.x, y: event.touches[0].clientY - dragRef.current.y });
    }
  }

  const imageStyle = {
    transform: "translate(" + offset.x + "px, " + offset.y + "px) scale(" + scale + ")",
    transition: dragging ? "none" : undefined
  };

  return (
    <div className="zoom-view" role="dialog" aria-modal="true" aria-label={"Zoomed in on " + painting.title}>
      <div className="zoom-top">
        <p className="zoom-title">{painting.title}</p>
        <div className="zoom-buttons">
          <button type="button" className="zoom-button" aria-label="Zoom out" onClick={() => changeScale(scale / 1.4)}>
            &minus;
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button type="button" className="zoom-button" aria-label="Zoom in" onClick={() => changeScale(scale * 1.4)}>
            +
          </button>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <CloseIcon size={22} />
          </button>
        </div>
      </div>
      <div
        className={"zoom-stage" + (dragging ? " zoom-dragging" : "")}
        onWheel={handleWheel}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={endDrag}
      >
        <img src={painting.image} alt={painting.title + " by " + painting.artist} className="zoom-image" style={imageStyle} draggable="false" />
      </div>
      <p className="zoom-hint">Scroll or pinch to zoom, drag to move around.</p>
    </div>
  );
}

export default ZoomView;
