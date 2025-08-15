import { useState, type ReactNode } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "./CustomTextInput.css";

interface CustomTextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "password";
  icon?: ReactNode;
  onEnter?: () => void;
}

const CustomTextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  onEnter,
}: CustomTextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-input-container d-flex flex-row align-items-center">
      <label>{label}</label>
      <input
        className="w-100 h-100"
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
      ) : (
        icon && <span className="form-input-icon">{icon}</span>
      )}
    </div>
  );
};

export default CustomTextInput;
