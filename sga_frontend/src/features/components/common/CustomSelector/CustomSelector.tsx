import React, { useState, useRef, useEffect } from "react";
import "./CustomSelector.css";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectorProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-selector" ref={selectorRef}>
      <div
        className={`selector-trigger ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
      >
        <span className="selector-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`selector-arrow ${isOpen ? "rotated" : ""}`}>▼</span>
      </div>

      {isOpen && (
        <div className="selector-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`selector-option ${
                value === option.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelector;
