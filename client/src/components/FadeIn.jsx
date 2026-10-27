import { useState, useEffect, useRef } from "react";
import "./FadeIn.css";

function FadeIn({ children, className }) {
  const boxRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  const boxClass = "fade-in" + (visible ? " fade-in-visible" : "") + (className ? " " + className : "");

  return (
    <div ref={boxRef} className={boxClass}>
      {children}
    </div>
  );
}

export default FadeIn;
