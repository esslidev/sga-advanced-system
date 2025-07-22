import React from "react";
import "./CustomSelector.css";

interface CustomSelectorProps {
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  isCentered?: boolean;
  placeholder?: string;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  name,
  value,
  options,
  onChange,
  required = true,
  isCentered,
  placeholder,
}) => {
  return (
    <div className="customSelector">
      <p>{name + " :"}</p>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={isCentered ? { textAlign: "center" } : {}}
      >
        {placeholder && (
          <option value="" disabled={required} hidden={!!value}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelector;
