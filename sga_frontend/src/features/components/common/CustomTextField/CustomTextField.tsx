import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

export type CustomTextFieldIconPosition = "left" | "right";

export const CustomTextFieldIconPosition = {
  LEFT: "left" as CustomTextFieldIconPosition,
  RIGHT: "right" as CustomTextFieldIconPosition,
};

export type DropdownAlignment = "left" | "right" | "center";

export const DropdownAlignment = {
  LEFT: "left" as DropdownAlignment,
  RIGHT: "right" as DropdownAlignment,
  CENTER: "center" as DropdownAlignment,
};

// Interfaces
export interface CustomTextFieldStyle {
  width?: number;
  height?: number;
  borderRadius?: number;
  textColor?: string;
  hintColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface DropdownStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxHeight?: number;
  itemHoverColor?: string;
  shadowColor?: string;
}

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface CustomTextFieldProps {
  width?: number;
  height?: number;
  margin?: string;
  padding?: string;
  borderRadius?: number;
  icon?: React.ReactNode | string;
  iconWidth?: number;
  iconHeight?: number;
  iconPosition?: CustomTextFieldIconPosition;
  iconColor?: string;
  hintText?: string;
  backgroundColor?: string;
  borderColor?: string;
  onChange?: (value: string) => void;
  keyboardType?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time"
    | "datetime-local";
  obscureText?: boolean;
  fontSize?: number;
  fontWeight?: string | number;
  hintFontWeight?: string | number;
  focusedBorderColor?: string;
  onFocusStyle?: CustomTextFieldStyle;
  textColor?: string;
  hintColor?: string;
  shadowColor?: string;
  shadowOffset?: { x: number; y: number };
  shadowBlurRadius?: number;
  dropdownItems?: DropdownItem[];
  dropdownAlignment?: DropdownAlignment;
  dropdownStyle?: DropdownStyle;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

// Icon mapping for string icons
const getIconComponent = (iconName: string, size: number = 20) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    search: Search,
    user: User,
    lock: Lock,
    mail: Mail,
    eye: Eye,
    "eye-off": EyeOff,
    "chevron-down": ChevronDown,
  };

  const IconComponent = iconMap[iconName.toLowerCase()];
  return IconComponent ? <IconComponent size={size} /> : null;
};

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  width,
  height = 48,
  margin = "0",
  padding = "12px 16px",
  borderRadius = 8,
  icon,
  iconWidth = 20,
  iconHeight = 20,
  iconPosition = CustomTextFieldIconPosition.LEFT,
  iconColor = "#666",
  hintText,
  backgroundColor = "#ffffff",
  borderColor = "#d1d5db",
  onChange,
  keyboardType = "text",
  obscureText = false,
  fontSize = 14,
  fontWeight = 400,
  hintFontWeight = 400,
  focusedBorderColor = "#3b82f6",
  onFocusStyle,
  textColor = "#1f2937",
  hintColor = "#9ca3af",
  shadowColor = "rgba(0, 0, 0, 0.1)",
  shadowOffset = { x: 0, y: 2 },
  shadowBlurRadius = 4,
  dropdownItems,
  dropdownAlignment = DropdownAlignment.LEFT,
  dropdownStyle,
  value: controlledValue,
  placeholder,
  disabled = false,
  autoFocus = false,
  onFocus,
  onBlur,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!obscureText);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleDropdown = () => {
    if (dropdownItems && dropdownItems.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleDropdownSelect = (item: DropdownItem) => {
    const newValue = item.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setIsDropdownOpen(false);
  };

  // Apply focus styles if provided
  const currentStyle = isFocused && onFocusStyle ? onFocusStyle : {};
  const finalBorderColor = isFocused
    ? currentStyle.borderColor || focusedBorderColor
    : currentStyle.borderColor || borderColor;
  const finalBackgroundColor = currentStyle.backgroundColor || backgroundColor;
  const finalTextColor = currentStyle.textColor || textColor;
  const finalHintColor = currentStyle.hintColor || hintColor;
  const finalIconColor = currentStyle.iconColor || iconColor;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    width: width ? `${width}px` : "100%",
    margin,
  };

  const inputContainerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: `${height}px`,
    backgroundColor: finalBackgroundColor,
    border: `1px solid ${finalBorderColor}`,
    borderRadius: `${borderRadius}px`,
    padding: padding,
    boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px ${shadowBlurRadius}px ${shadowColor}`,
    transition: "all 0.2s ease-in-out",
    cursor: disabled ? "not-allowed" : "text",
    opacity: disabled ? 0.6 : 1,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: finalTextColor,
    fontSize: `${fontSize}px`,
    fontWeight,
    margin: 0,
    padding: 0,
  };

  const placeholderStyle = `
    .custom-input::placeholder {
      color: ${finalHintColor};
      font-weight: ${hintFontWeight};
      opacity: 1;
    }
  `;

  const iconStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: finalIconColor,
    cursor:
      keyboardType === "password" &&
      iconPosition === CustomTextFieldIconPosition.RIGHT
        ? "pointer"
        : "default",
    marginLeft:
      iconPosition === CustomTextFieldIconPosition.RIGHT ? "8px" : "0",
    marginRight:
      iconPosition === CustomTextFieldIconPosition.LEFT ? "8px" : "0",
  };

  const dropdownStyle_: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    width: "100%",
    backgroundColor: dropdownStyle?.backgroundColor || "#ffffff",
    border: `1px solid ${dropdownStyle?.borderColor || "#d1d5db"}`,
    borderRadius: `${dropdownStyle?.borderRadius || 8}px`,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    maxHeight: `${dropdownStyle?.maxHeight || 200}px`,
    overflowY: "auto",
    marginTop: "4px",
    ...(dropdownAlignment === DropdownAlignment.CENTER && {
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(dropdownAlignment === DropdownAlignment.LEFT && {
      left: "0",
    }),
    ...(dropdownAlignment === DropdownAlignment.RIGHT && {
      right: "0",
    }),
  };

  const renderIcon = () => {
    if (!icon) return null;

    if (
      keyboardType === "password" &&
      iconPosition === CustomTextFieldIconPosition.RIGHT
    ) {
      return (
        <div style={iconStyle} onClick={togglePasswordVisibility}>
          {isPasswordVisible ? (
            <Eye size={iconWidth} />
          ) : (
            <EyeOff size={iconWidth} />
          )}
        </div>
      );
    }

    if (
      dropdownItems &&
      dropdownItems.length > 0 &&
      iconPosition === CustomTextFieldIconPosition.RIGHT
    ) {
      return (
        <div style={iconStyle} onClick={toggleDropdown}>
          <ChevronDown
            size={iconWidth}
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </div>
      );
    }

    if (typeof icon === "string") {
      return <div style={iconStyle}>{getIconComponent(icon, iconWidth)}</div>;
    }

    return <div style={iconStyle}>{icon}</div>;
  };

  const getInputType = () => {
    if (keyboardType === "password") {
      return isPasswordVisible ? "text" : "password";
    }
    return keyboardType || "text";
  };

  return (
    <div style={containerStyle} className={className} ref={dropdownRef}>
      <style>{placeholderStyle}</style>
      <div
        style={inputContainerStyle}
        onClick={() => inputRef.current?.focus()}
      >
        {iconPosition === CustomTextFieldIconPosition.LEFT && renderIcon()}
        <input
          ref={inputRef}
          type={getInputType()}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || hintText}
          disabled={disabled}
          autoFocus={autoFocus}
          style={inputStyle}
          className="custom-input"
        />
        {iconPosition === CustomTextFieldIconPosition.RIGHT && renderIcon()}
      </div>

      {isDropdownOpen && dropdownItems && dropdownItems.length > 0 && (
        <div style={dropdownStyle_}>
          {dropdownItems.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "1px solid #f3f4f6",
                transition: "background-color 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor =
                  dropdownStyle?.itemHoverColor || "#f9fafb";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "transparent";
              }}
              onClick={() => handleDropdownSelect(item)}
            >
              {item.icon && (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomTextField;
