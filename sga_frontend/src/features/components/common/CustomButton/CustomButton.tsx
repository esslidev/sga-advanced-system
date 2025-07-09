import React from "react";
import "./CustomButton.css";

interface CustomButtonProps {
  name: string;
  isInsert?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  name,
  isInsert = false,
}) => {
  return (
    <div>
      <button
        className={`customButton ${
          isInsert === true ? "customButtonOnInsert" : ""
        }`}
      >
        {name}
      </button>
    </div>
  );
};

export default CustomButton;
