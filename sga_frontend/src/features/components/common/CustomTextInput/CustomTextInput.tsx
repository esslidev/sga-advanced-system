import React from "react";
import "./CustomTextInput.css";

interface CustomTextInputProps {
  name: string;
  type: React.HTMLInputTypeAttribute;
  isCentered?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  name,
  type,
  isCentered,
}) => {
  return (
    <div className="customTextInput">
      <p>{name + " :"}</p>
      <input
        type={type}
        id={name}
        name={name}
        required
        placeholder={name}
        style={isCentered ? { textAlign: "center" } : {}}
      />
    </div>
  );
};

export default CustomTextInput;
