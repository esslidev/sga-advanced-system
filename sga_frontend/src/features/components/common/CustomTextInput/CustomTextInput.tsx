import { useState, type ReactNode, type CSSProperties, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import "./CustomTextInput.css";

interface CustomTextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "date" | "time" | "datetime-local";
  icon?: ReactNode;
  onEnter?: () => void;
  className?: string;
  style?: CSSProperties;
  inputClassName?: string;
  inputStyle?: CSSProperties;
}

const CustomTextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  onEnter,
  className,
  style,
  inputClassName,
  inputStyle,
}: CustomTextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPassword = type === "password";
  const isDate = type === "date";
  const isTime = type === "time";

  // Determine which icon to show for date/time
  const renderCustomIcon = () => {
    if (isDate) return <CalendarIcon />;
    if (isTime) return <ClockIcon />;
    return icon;
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // modern browsers support this
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`form-input-container d-flex flex-row align-items-center ${
        className ?? ""
      }`}
      style={style}
    >
      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        className={`w-100 h-100 ${inputClassName ?? ""}`}
        style={inputStyle}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        required
      />
      {isPassword ? (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="form-input-icon"
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </span>
      ) : isDate || isTime ? (
        <span
          onClick={handleIconClick}
          className="form-input-icon d-flex align-items-center justify-content-center"
          style={{ cursor: "pointer" }}
        >
          {renderCustomIcon()}
        </span>
      ) : (
        icon && <span className="form-input-icon">{icon}</span>
      )}
    </div>
  );
};

export default CustomTextInput;
