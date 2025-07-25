// components/VisitRowEditable.tsx

import { useState, type JSX } from "react";
import { divisionOptions, type Visit } from "../../../models/visit";
import { AppUtil } from "../../../../core/utils/appUtil";

type VisitRowEditableProps = {
  visit: Visit;
  onCancel: () => void;
  onSave: (updatedVisit: Visit) => void;
};

const VisitRowEditable = ({
  visit,
  onCancel,
  onSave,
}: VisitRowEditableProps): JSX.Element[] => {
  const [visitDate, setVisitDate] = useState(visit.visitDate); // Format: YYYY-MM-DD
  const [visitReason, setVisitReason] = useState(visit.visitReason);
  const [divisions, setDivisions] = useState<string[]>(visit.divisions);

  const handleDivisionChange = (division: string) => {
    setDivisions((prev) =>
      prev.includes(division)
        ? prev.filter((d) => d !== division)
        : [...prev, division]
    );
  };

  const handleSave = () => {
    onSave({
      ...visit,
      visitDate,
      visitReason,
    });
  };

  return [
    <p dir="ltr" key={`${visit.id}-id`}>
      {"#" + visit.id.slice(-8).toUpperCase()}
    </p>,

    <input
      key={`${visit.id}-date`}
      type="date"
      value={AppUtil.formatDateTimeToArabic(new Date(visit.visitDate))}
      onChange={(e) => setVisitDate(new Date(e.target.value))}
    />,

    <input
      key={`${visit.id}-reason`}
      type="text"
      value={visitReason}
      onChange={(e) => setVisitReason(e.target.value)}
    />,

    <div key={`${visit.id}-divisions`}>
      {divisionOptions.map((opt) => (
        <label key={opt.value} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={divisions.includes(opt.value)}
            onChange={() => handleDivisionChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>,

    <div key={`${visit.id}-actions`} className="actions">
      <button className="btn btn-success" onClick={handleSave}>
        حفظ
      </button>
      <button className="btn btn-secondary" onClick={onCancel}>
        إلغاء
      </button>
    </div>,
  ];
};

export default VisitRowEditable;
