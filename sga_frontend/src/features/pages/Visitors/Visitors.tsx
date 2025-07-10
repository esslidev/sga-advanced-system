import React from "react";
import { useVisitor } from "../../hooks/useVisitor";
import "./Visitors.css";
import CustomTable from "../../components/common/CustomDataGrid/CustomTable";

const VisitorsPage = () => {
  const { createVisitor, selectedVisitor, visitors, loading, response } =
    useVisitor();

  const header = ["رقم البطاقة الوطنية", "الإسم الشخصي", "الإسم العائلي"];

  //fake data
  const data = [
    { cin: 1, first_name: "فاطمة", last_name: "العمري" },
    { cin: 2, first_name: "يوسف", last_name: "العمري" },
    { cin: 3, first_name: "خديجة", last_name: "بناني" },
    { cin: 4, first_name: "سعيد", last_name: "الهلالي" },
    { cin: 1, first_name: "فاطمة", last_name: "العمري" },
    { cin: 2, first_name: "يوسف", last_name: "العمري" },
    { cin: 3, first_name: "خديجة", last_name: "بناني" },
    { cin: 4, first_name: "سعيد", last_name: "الهلالي" },
    { cin: 1, first_name: "فاطمة", last_name: "الناصري" },
  ];

  const cells = data.map((row) => [row.cin, row.first_name, row.last_name]);

  return (
    <div className="page ">
      <h1 className="title">تتبع التحصيل</h1>
      <CustomTable
        headerCells={header}
        cells={cells}
        rowColor1="#fff"
        rowColor2="#f9f9f9"
        borderColor="#ccc"
        borderWidth={1}
        padding="12px"
        alignment="left"
        headerStyle={{
          color: "#e0e0e0",
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 6,
          textStyle: { fontSize: "16px", fontWeight: "600", color: "#222" },
          alignment: "left",
        }}
      />
    </div>
  );
};

export default VisitorsPage;
