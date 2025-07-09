import React from "react";
import { useVisitor } from "../../hooks/useVisitor";
import "./Visitors.css";
import CustomTable from "../../components/common/CustomTable/CustomDataGrid";

const VisitorsPage = () => {
  const { createVisitor, selectedVisitor, visitors, loading, response } =
    useVisitor();

  return (
    <div className="page ">
      <div className="container">
        <h1 className="title">تتبع التحصيل</h1>
        <CustomTable />
      </div>
    </div>
  );
};

export default VisitorsPage;
