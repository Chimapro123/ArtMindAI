import { useRef } from "react";
import "./CodeBoxes.css";

const length = 6;

function CodeBoxes({ code, onChange }) {
  const boxes = useRef([]);
  const digits = Array.from({ length }, (item, index) => code[index] || "");

  function focusBox(index) {
    const box = boxes.current[Math.max(0, Math.min(length - 1, index))];
    if (box) {
      box.focus();
      box.select();
    }
  }

  function setDigit(index, value) {
    const next = [...digits];
    next[index] = value;
    onChange(next.join(""));
  }

  function fillFrom(start, text) {
    const next = [...digits];
    let position = start;
    text.split("").forEach((digit) => {
      if (position < length) {
        next[position] = digit;
        position += 1;
      }
    });
    onChange(next.join(""));
    focusBox(Math.min(length - 1, position));
  }

  function handleChange(index, event) {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) {
      setDigit(index, "");
      return;
    }
    if (typed.length > 1) {
      fillFrom(index, typed);
      return;
    }
    setDigit(index, typed);
    focusBox(index + 1);
  }

  function handlePaste(index, event) {
    event.preventDefault();
    const pasted = (event.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (pasted) {
      fillFrom(index, pasted);
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, "");
      focusBox(index - 1);
    }
    if (event.key === "ArrowLeft") {
      focusBox(index - 1);
    }
    if (event.key === "ArrowRight") {
      focusBox(index + 1);
    }
  }

  return (
    <div className="code-boxes">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={6}
          className={"code-box" + (digit ? " code-box-filled" : "")}
          aria-label={"Digit " + (index + 1)}
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}

export default CodeBoxes;
