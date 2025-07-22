import React from "react";
import "./CustomButton.css";

interface CustomButtonProps {
  name: string;
  isInsert?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  name,
  isInsert = false,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <div>
      <button
        type={type}
        className={`customButton ${isInsert ? "customButtonOnInsert" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {name}
      </button>
    </div>
  );
};

export default CustomButton;
