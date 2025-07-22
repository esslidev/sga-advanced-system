import { useState } from "react";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { useVisit } from "../../hooks/useVisit";
import { HttpStatusCode } from "axios";
import { Division, Visit } from "../../models/visit";

import "./VisitDataEntry.css";
import CustomSelector from "../../components/common/CustomSelector/CustomSelector";

interface VisitFormData {
  CIN: string;
  firstName: string;
  lastName: string;
  visitDate: Date;
  division: Division;
  visitReason: string;
}

const VisitDataEntryPage = () => {
  const [formData, setFormData] = useState<VisitFormData>({
    CIN: "",
    firstName: "",
    lastName: "",
    visitDate: new Date(),
    division: Division.example1,
    visitReason: "",
  });

  const divisionOptions = Object.entries(Division).map(([key, value]) => ({
    value,
    label: value,
  }));

  const { createVisit } = useVisit();

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.CIN?.trim() ||
      !formData.firstName?.trim() ||
      !formData.lastName?.trim() ||
      !formData.visitReason?.trim()
    ) {
      alert("الرجاء ملء جميع الحقول المطلوبة.");
      return;
    }

    try {
      const visitPayload: Partial<Visit> & {
        visitor: { CIN: string; firstName: string; lastName: string };
      } = {
        visitor: {
          CIN: formData.CIN.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
        visitorCIN: formData.CIN.trim(),
        visitDate: formData.visitDate,
        division: formData.division,
        visitReason: formData.visitReason.trim(),
      };

      const visitActionResult = await createVisit(visitPayload);
      const visitResult = visitActionResult.payload;

      if (
        ![HttpStatusCode.Ok, HttpStatusCode.Created].includes(
          visitResult?.statusCode || 0
        )
      ) {
        alert(visitResult?.message || "حدث خطأ أثناء تسجيل الزيارة");
        return;
      }

      alert("تم تسجيل الزيارة بنجاح!");

      // Reset form
      setFormData({
        CIN: "",
        firstName: "",
        lastName: "",
        visitDate: new Date(),
        division: Division.example1,
        visitReason: "",
      });
    } catch (error: any) {
      alert("حدث خطأ: " + (error.message || error));
    }
  };

  return (
    <div className="page visitorDataEntryPage">
      <h1 className="title">تحصيل الزيارة</h1>
      <div className="divisions">
        <div className="division">
          <CustomTextInput
            name="رقم البطاقة الوطنية"
            type="text"
            value={formData.CIN}
            onChange={(e) => setFormData({ ...formData, CIN: e.target.value })}
          />
        </div>
        <div className="division">
          <CustomTextInput
            name="الإسم الشخصي"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <CustomTextInput
            name="الإسم العائلي"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <CustomTextInput
            name="تاريخ الزيارة"
            type="date"
            isCentered
            value={formData.visitDate.toISOString().split("T")[0]} // YYYY-MM-DD
            onChange={(e) => {
              const newDate = new Date(formData.visitDate);
              const [year, month, day] = e.target.value.split("-").map(Number);
              // Update year, month (zero-based), day, keep time as is
              newDate.setFullYear(year, month - 1, day);
              setFormData({ ...formData, visitDate: newDate });
            }}
          />
          <CustomTextInput
            name="ساعة الزيارة"
            type="time"
            isCentered
            value={formData.visitDate.toTimeString().substring(0, 5)} // HH:mm
            onChange={(e) => {
              const newDate = new Date(formData.visitDate);
              const [hours, minutes] = e.target.value.split(":").map(Number);
              newDate.setHours(hours, minutes);
              setFormData({ ...formData, visitDate: newDate });
            }}
          />
          {
            <CustomSelector
              name="القسم"
              value={formData.division}
              options={divisionOptions}
              placeholder="اختر القسم"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  division: e.target.value as Division,
                })
              }
            />
          }
          <CustomTextInput
            name="سبب الزيارة"
            type="text"
            value={formData.visitReason}
            onChange={(e) =>
              setFormData({ ...formData, visitReason: e.target.value })
            }
          />
        </div>
        <div className="division buttonDivision">
          <CustomButton name="التسجيل" isInsert={true} onClick={handleSubmit} />
          <CustomButton name="الإلغاء" />
        </div>
      </div>
    </div>
  );
};

export default VisitDataEntryPage;
