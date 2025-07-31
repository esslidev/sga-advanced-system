// components/VisitRow.tsx

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { AppUtil } from "../../../../core/utils/appUtil";
import { divisionOptions, type Visit } from "../../../models/visit";

type VisitRowProps = {
  visit: Visit;
  onDelete: (id: string) => void;
  onUpdate?: (updatedVisit: Visit) => void;
};

// Return type is JSX.Element[] because you're returning table "cells"
const VisitRow = ({
  visit,
  onDelete,
  onUpdate,
}: VisitRowProps): JSX.Element[] => {
  const [currentVisit, setCurrentVisit] = useState<Visit>(visit);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    visitReason: visit.visitReason,
    divisions: visit.divisions,
  });

  // Update local state when visit prop changes
  useEffect(() => {
    setCurrentVisit(visit);
    setEditFormData({
      visitReason: visit.visitReason,
      divisions: visit.divisions,
    });
  }, [visit]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setEditFormData({
        visitReason: currentVisit.visitReason,
        divisions: currentVisit.divisions,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const updatedVisit: Visit = {
      ...currentVisit,
      visitReason: editFormData.visitReason,
      divisions: editFormData.divisions,
    };

    setCurrentVisit(updatedVisit);
    setIsEditing(false);

    // Call the onUpdate callback if provided
    if (onUpdate) {
      onUpdate(updatedVisit);
    }
  };

  return [
    <p dir="ltr" key={`${currentVisit.id}-id`}>
      {"#" + currentVisit.id.slice(-8).toUpperCase()}
    </p>,

    <p key={`${currentVisit.visitDate}-visitDate`}>
      {AppUtil.formatDateTimeToArabic(new Date(currentVisit.visitDate))}
    </p>,

    // Editable visit reason
    <div key={`${currentVisit.visitReason}-visitReason`}>
      {isEditing ? (
        <input
          type="text"
          value={editFormData.visitReason}
          onChange={(e) =>
            setEditFormData((prev) => ({
              ...prev,
              visitReason: e.target.value,
            }))
          }
          className="form-control"
        />
      ) : (
        <p>{currentVisit.visitReason}</p>
      )}
    </div>,

    // Editable divisions
    <div key={`${currentVisit.id}-divisions`}>
      {isEditing ? (
        <div className="divisions-edit">
          {divisionOptions.map((option) => (
            <label key={option.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={editFormData.divisions.includes(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <div>
          {currentVisit.divisions.map((division) => (
            <p key={division}>
              {divisionOptions.find((d) => d.value === division)?.label}
            </p>
          ))}
        </div>
      )}
    </div>,

    // Updated actions with edit/save/cancel functionality
    <div key={`${currentVisit.id}-actions`} className="actions">
      {isEditing ? (
        <>
          <button className="btn btn-success" onClick={handleSave}>
            حفظ
          </button>
          <button className="btn btn-secondary" onClick={handleEditToggle}>
            إلغاء
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-primary" onClick={handleEditToggle}>
            تعديل الزيارة
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(currentVisit.id)}
          >
            حذف
          </button>
        </>
      )}
    </div>,
  ];
};

export default VisitRow;
