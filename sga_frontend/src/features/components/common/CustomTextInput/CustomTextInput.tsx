import React from "react";
import "./CustomTextInput.css";

interface CustomTextInputProps {
  name: string;
  type: React.HTMLInputTypeAttribute;
  isCentered?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  name,
  type,
  isCentered,
  value,
  onChange,
  required = true,
  placeholder,
}) => {
  return (
    <div className="customTextInput">
      <p>{name + " :"}</p>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || name}
        style={isCentered ? { textAlign: "center" } : {}}
      />
    </div>
  );
};

export default CustomTextInput;
