// components/VisitRow.tsx

import type { JSX } from "react";
import { AppUtil } from "../../../../core/utils/appUtil";
import { divisionOptions, type Visit } from "../../../models/visit";

type VisitRowProps = {
  visit: Visit;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

// Return type is JSX.Element[] because you're returning table "cells"
const VisitRow = ({
  visit,
  onDelete,
  onEdit,
}: VisitRowProps): JSX.Element[] => {
  return [
    <p dir="ltr" key={`${visit.id}-id`}>
      {"#" + visit.id.slice(-8).toUpperCase()}
    </p>,

    <p key={`${visit.visitDate}-visitDate`}>
      {AppUtil.formatDateTimeToArabic(new Date(visit.visitDate))}
    </p>,

    <p key={`${visit.visitReason}-visitReason`}>{visit.visitReason}</p>,

    <div key={`${visit.id}-divisions`}>
      {visit.divisions.map((division) => (
        <p key={division}>
          {divisionOptions.find((d) => d.value === division)?.label}
        </p>
      ))}
    </div>,

    <div key={`${visit.id}-actions`} className="actions">
      <button className="btn btn-primary" onClick={() => onEdit(visit.id)}>
        تعديل الزيارة
      </button>
      <button className="btn btn-danger" onClick={() => onDelete(visit.id)}>
        حذف
      </button>
    </div>,
  ];
};

export default VisitRow;
