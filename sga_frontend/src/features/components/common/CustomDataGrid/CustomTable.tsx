import React from "react";

export type CustomTableTheme =
  | "default"
  | "green"
  | "dark"
  | "minimal"
  | "corporate";

export const CustomTableTheme = {
  DEFAULT: "default",
  GREEN: "green",
  DARK: "dark",
  MINIMAL: "minimal",
  CORPORATE: "corporate",
} as const;

export type ColumnWidth =
  | string
  | number
  | "auto"
  | "min-content"
  | "max-content";

export type CustomTableAlignment = "left" | "center" | "right";

export const CustomTableAlignment = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

interface ThemeConfig {
  headerBg: string;
  headerText: string;
  rowColor1: string;
  rowColor2: string;
  borderColor: string;
  hoverColor: string;
  textColor: string;
  shadow: boolean;
}

interface CustomTableStyle {
  color?: string;
  padding?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  textStyle?: React.CSSProperties;
  alignment?: CustomTableAlignment;
}

interface CustomTableProps {
  headerCells?: React.ReactNode[];
  cells: React.ReactNode[][];
  columnWidths?: ColumnWidth[];
  theme?: CustomTableTheme;
  rowColor1?: string;
  rowColor2?: string;
  padding?: string;
  alignment?: CustomTableAlignment;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  textStyle?: React.CSSProperties;
  headerStyle?: CustomTableStyle;
  hoverable?: boolean;
  striped?: boolean;
  compact?: boolean;
  shadow?: boolean;
  responsive?: boolean;
}

const defaultPadding = "12px 16px";
const defaultFontSize = "14px";

const alignmentToFlex = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

// Theme configurations
const themes: Record<CustomTableTheme, ThemeConfig> = {
  [CustomTableTheme.DEFAULT]: {
    headerBg: "#f1f5f9",
    headerText: "#374151",
    rowColor1: "#ffffff",
    rowColor2: "#f8fafc",
    borderColor: "#e2e8f0",
    hoverColor: "#f0f9ff",
    textColor: "#4b5563",
    shadow: true,
  },
  [CustomTableTheme.GREEN]: {
    headerBg: "#10b981",
    headerText: "#ffffff",
    rowColor1: "#ffffff",
    rowColor2: "#ecfdf5",
    borderColor: "#a7f3d0",
    hoverColor: "#d1fae5",
    textColor: "#065f46",
    shadow: true,
  },
  [CustomTableTheme.DARK]: {
    headerBg: "#1f2937",
    headerText: "#f9fafb",
    rowColor1: "#374151",
    rowColor2: "#4b5563",
    borderColor: "#6b7280",
    hoverColor: "#4b5563",
    textColor: "#f3f4f6",
    shadow: true,
  },
  [CustomTableTheme.MINIMAL]: {
    headerBg: "#ffffff",
    headerText: "#374151",
    rowColor1: "#ffffff",
    rowColor2: "#ffffff",
    borderColor: "#f3f4f6",
    hoverColor: "#f9fafb",
    textColor: "#4b5563",
    shadow: false,
  },
  [CustomTableTheme.CORPORATE]: {
    headerBg: "#1e3a8a",
    headerText: "#ffffff",
    rowColor1: "#ffffff",
    rowColor2: "#f8fafc",
    borderColor: "#cbd5e1",
    hoverColor: "#e2e8f0",
    textColor: "#334155",
    shadow: true,
  },
};

const CustomTable: React.FC<CustomTableProps> = ({
  headerCells,
  cells,
  columnWidths,
  theme = CustomTableTheme.DEFAULT,
  rowColor1,
  rowColor2,
  padding = defaultPadding,
  alignment = "left",
  borderRadius = 8,
  borderWidth = 1,
  borderColor,
  textStyle,
  headerStyle,
  hoverable = true,
  striped = true,
  compact = false,
  shadow,
  responsive = true,
}) => {
  const computedPadding = compact ? "8px 12px" : padding;

  // Get theme configuration
  const themeConfig = themes[theme];

  // Determine if hover should be enabled (prioritize disableHover over hoverable)
  const isHoverEnabled = hoverable;

  // Use theme values as defaults, allow props to override
  const finalRowColor1 = rowColor1 || themeConfig.rowColor1;
  const finalRowColor2 = rowColor2 || themeConfig.rowColor2;
  const finalBorderColor = borderColor || themeConfig.borderColor;
  const finalShadow = shadow !== undefined ? shadow : themeConfig.shadow;

  // Helper function to convert column width to CSS style
  const getColumnStyle = (index: number): React.CSSProperties => {
    if (!columnWidths || !columnWidths[index]) {
      return { flex: 1 };
    }

    const width = columnWidths[index];

    // Handle different width types
    if (typeof width === "number") {
      return { width: `${width}px`, flexShrink: 0 };
    }

    if (typeof width === "string") {
      // Handle CSS keywords
      if (
        width === "auto" ||
        width === "min-content" ||
        width === "max-content"
      ) {
        return { width, flexShrink: 0 };
      }

      // Handle percentage, px, rem, etc.
      if (
        width.includes("%") ||
        width.includes("px") ||
        width.includes("rem") ||
        width.includes("em")
      ) {
        return { width, flexShrink: 0 };
      }

      // Handle flex ratios (e.g., "2", "0.5")
      const flexValue = parseFloat(width);
      if (!isNaN(flexValue)) {
        return { flex: flexValue };
      }
    }

    // Default fallback
    return { flex: 1 };
  };

  // Enhanced cell renderer with better styling
  const renderCell = (
    content: React.ReactNode,
    isHeader = false,
    key?: React.Key
  ) => {
    const baseStyle: React.CSSProperties = {
      padding: isHeader
        ? headerStyle?.padding || computedPadding
        : computedPadding,
      display: "flex",
      justifyContent: alignmentToFlex[headerStyle?.alignment || alignment],
      alignItems: "center",
      fontSize: isHeader
        ? headerStyle?.textStyle?.fontSize || "14px"
        : textStyle?.fontSize || defaultFontSize,
      fontWeight: isHeader ? 600 : 400,
      color: isHeader
        ? headerStyle?.textStyle?.color || themeConfig.headerText
        : textStyle?.color || themeConfig.textColor,
      transition: isHoverEnabled ? "all 0.2s ease" : "none",
      minHeight: compact ? "36px" : "44px",
      wordBreak: "break-word",
      ...(!isHeader ? textStyle : headerStyle?.textStyle),
    };

    return (
      <div key={key} style={baseStyle}>
        {content}
      </div>
    );
  };

  const tableStyle: React.CSSProperties = {
    borderRadius,
    overflow: "hidden",
    border: `${borderWidth}px solid ${finalBorderColor}`,
    backgroundColor: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    ...(finalShadow && {
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    }),
    ...(responsive && {
      width: "100%",
      maxWidth: "100%",
    }),
  };

  const headerRowStyle: React.CSSProperties = {
    display: "flex",
    backgroundColor: headerStyle?.color || themeConfig.headerBg,
    borderBottom: `${headerStyle?.borderWidth ?? borderWidth}px solid ${
      headerStyle?.borderColor ?? finalBorderColor
    }`,
    backgroundImage:
      theme !== CustomTableTheme.MINIMAL
        ? "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.05))"
        : "none",
  };

  return (
    <div style={tableStyle}>
      {/* Enhanced Header */}
      {headerCells && (
        <div style={headerRowStyle}>
          {headerCells.map((cell, i) => (
            <div
              key={i}
              style={{
                ...getColumnStyle(i),
                userSelect: "none",
                position: "relative",
                ...(i < headerCells.length - 1 && {
                  borderRight: `1px solid ${finalBorderColor}`,
                }),
              }}
            >
              {renderCell(cell, true, i)}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Data Rows */}
      {cells.map((row, rowIndex) => {
        const isEven = rowIndex % 2 === 0;
        const bgColor = striped
          ? isEven
            ? finalRowColor1
            : finalRowColor2
          : finalRowColor1;

        const rowStyle: React.CSSProperties = {
          display: "flex",
          backgroundColor: bgColor,
          borderBottom:
            rowIndex < cells.length - 1
              ? `${borderWidth}px solid ${finalBorderColor}`
              : "none",
          transition: isHoverEnabled ? "all 0.2s ease" : "none",
          ...(isHoverEnabled && {
            cursor: "pointer",
          }),
        };

        // Add hover styles using CSS-in-JS approach
        const hoverStyle = isHoverEnabled
          ? {
              backgroundColor: themeConfig.hoverColor,
              transform: "translateY(-1px)",
            }
          : {};

        return (
          <div
            key={rowIndex}
            style={rowStyle}
            onMouseEnter={(e) => {
              if (isHoverEnabled) {
                Object.assign(e.currentTarget.style, hoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (isHoverEnabled) {
                e.currentTarget.style.backgroundColor = bgColor;
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{
                  ...getColumnStyle(colIndex),
                  ...(colIndex < row.length - 1 && {
                    borderRight: `1px solid rgba(0,0,0,0.05)`,
                  }),
                }}
              >
                {renderCell(cell, false)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default CustomTable;
