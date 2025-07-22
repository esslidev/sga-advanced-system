import React, { useState, useRef, useEffect, CSSProperties } from "react";
import "./AutoResizeTextarea.css";

interface AutoResizeTextareaProps {
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  style?: CSSProperties;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  name,
  value = "",
  onChange,
  placeholder = "Start typing...",
  minRows = 2,
  maxRows = 10,
  style = {},
}) => {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const computed = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computed.lineHeight || "20", 10);
    const paddingTop = parseInt(computed.paddingTop || "0", 10);
    const paddingBottom = parseInt(computed.paddingBottom || "0", 10);

    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange?.(e);
    setTimeout(adjustHeight, 0);
  };

  useEffect(() => {
    adjustHeight();
  }, [text, minRows, maxRows]);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      className="auto-resize-textarea"
      style={style}
    />
  );
};

export default AutoResizeTextarea;
