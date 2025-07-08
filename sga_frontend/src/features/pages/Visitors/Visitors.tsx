import React from "react";
import { useVisitor } from "../../hooks/useVisitor";
import "./Visitors.css";

const VisitorsPage = () => {
  const { createVisitor, selectedVisitor, visitors, loading, response } =
    useVisitor();

  return <div className="page">visitors</div>;
};

export default VisitorsPage;
