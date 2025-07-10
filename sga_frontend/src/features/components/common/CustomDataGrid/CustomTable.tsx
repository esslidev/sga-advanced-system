import React from "react";

export enum TableAlignement {
  left,
  center,
  right,
}

interface CustomTableStyle {
  color?: string;
  padding?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  textStyle?: React.CSSProperties;
  alignment?: "left" | "center" | "right";
}

interface CustomTableProps {
  headerCells?: React.ReactNode[];
  cells: React.ReactNode[][];
  rowColor1?: string;
  rowColor2?: string;
  padding?: string;
  alignment?: "left" | "center" | "right";
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  textStyle?: React.CSSProperties;
  headerStyle?: CustomTableStyle;
}

const defaultPadding = "8px";
const defaultFontSize = 12;

const alignmentToFlex = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const CustomTable: React.FC<CustomTableProps> = ({
  headerCells,
  cells,
  rowColor1 = "#fff",
  rowColor2 = "#f7f7f7",
  padding = defaultPadding,
  alignment = "left",
  borderRadius = 0,
  borderWidth = 1,
  borderColor = "transparent",
  textStyle,
  headerStyle,
}) => {
  // Helper to render cell content with style and alignment
  const renderCell = (
    content: React.ReactNode,
    isHeader = false,
    key?: React.Key
  ) => {
    const style: React.CSSProperties = {
      padding,
      display: "flex",
      justifyContent: alignmentToFlex[headerStyle?.alignment || alignment],
      borderBottom: `${borderWidth}px solid ${borderColor}`,
      borderRadius: isHeader
        ? headerStyle?.borderRadius ?? borderRadius
        : borderRadius,
      backgroundColor: isHeader ? headerStyle?.color : undefined,
      color: isHeader
        ? headerStyle?.textStyle?.color || "black"
        : textStyle?.color || "black",
      fontWeight: isHeader ? 600 : 400,
      fontSize: headerStyle?.textStyle?.fontSize
        ? headerStyle.textStyle.fontSize
        : defaultFontSize,
      ...(!isHeader ? textStyle : headerStyle?.textStyle),
    };

    if (typeof content === "string" || typeof content === "number") {
      return (
        <div key={key} style={style}>
          {content}
        </div>
      );
    }
    // If content is already a React node (like <span> or <div>)
    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  return (
    <div style={{}}>
      {/* Header row */}
      {headerCells && (
        <div
          style={{
            display: "flex",
            borderBottom: `${headerStyle?.borderWidth ?? borderWidth}px solid ${
              headerStyle?.borderColor ?? "transparent"
            }`,
            borderRadius: headerStyle?.borderRadius ?? borderRadius,
            backgroundColor: headerStyle?.color ?? "white",
          }}
        >
          {headerCells.map((cell, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                ...(!headerStyle?.padding ? { padding } : undefined),
                userSelect: "none",
              }}
            >
              {renderCell(cell, true, i)}
            </div>
          ))}
        </div>
      )}

      {/* Data rows */}
      {cells.map((row, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? rowColor1 : rowColor2;
        return (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              backgroundColor: bgColor,
              borderBottom: `${borderWidth}px solid ${borderColor}`,
              borderRadius,
            }}
          >
            {row.map((cell, colIndex) => (
              <div key={colIndex} style={{ flex: 1 }}>
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
