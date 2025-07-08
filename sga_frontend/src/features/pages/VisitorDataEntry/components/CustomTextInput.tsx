import React from "react";

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
  const inputStyle: React.CSSProperties = isCentered
    ? { textAlign: "center" }
    : {};

  return (
    <div>
      <p>{name + " :"}</p>
      <input
        type={type}
        id={name}
        name={name}
        required
        placeholder={name}
        style={inputStyle}
      />
    </div>
  );
};

export default CustomTextInput;
