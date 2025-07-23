import { useRef, useState } from "react";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { useVisit } from "../../hooks/useVisit";
import { HttpStatusCode } from "axios";
import {
  Division,
  divisionOptions,
  type DivisionOption,
  type Visit,
} from "../../models/visit";

import "./VisitDataEntry.css";
import Multiselect from "multiselect-react-dropdown";
import AutoResizeTextarea from "../../components/common/CustomTextArea/AutoResizeTextarea";

interface VisitFormData {
  CIN: string;
  firstName: string;
  lastName: string;
  visitDate: Date;
  divisions: Division[];
  visitReason: string;
}

const VisitDataEntryPage = () => {
  const { createVisit } = useVisit();

  const multiselectRef = useRef<Multiselect>(null);
  const [formData, setFormData] = useState<VisitFormData>({
    CIN: "",
    firstName: "",
    lastName: "",
    visitDate: new Date(),
    divisions: [],
    visitReason: "",
  });

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.CIN?.trim() ||
      !formData.firstName?.trim() ||
      !formData.lastName?.trim() ||
      !formData.visitReason?.trim() ||
      formData.divisions.length === 0 ||
      formData.visitDate.toString() === "Invalid Date"
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
        divisions: formData.divisions,
        visitReason: formData.visitReason.trim(),
      };

      console.log("Submitting visit data:", visitPayload);

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
        divisions: [],
        visitReason: "",
      });

      // reset multiselect UI
      if (multiselectRef.current) {
        multiselectRef.current.resetSelectedValues();
      }
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
            value={formData.visitDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newDate = new Date(formData.visitDate);
              const [year, month, day] = e.target.value.split("-").map(Number);
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
            <div>
              <p>الأقسام:</p>
              <Multiselect
                ref={multiselectRef}
                className="custom-multiselect"
                options={divisionOptions.map((option) => ({
                  name: option.label,
                  value: option.value,
                }))}
                displayValue="name"
                placeholder="اختر القسم"
                emptyRecordMsg="لا توجد خيارات متاحة"
                onSelect={(selected: DivisionOption[]) => {
                  setFormData({
                    ...formData,
                    divisions: selected.map((s) => s.value as Division), // if you use enum Division
                  });
                }}
                onRemove={(selected: DivisionOption[]) => {
                  setFormData({
                    ...formData,
                    divisions: selected.map((s) => s.value as Division),
                  });
                }}
                isObject={true}
                style={{
                  chips: {
                    gap: "4px",
                    borderRadius: "4px",
                    background: "var(--primary-color)",
                  },
                  multiselectContainer: {
                    width: "500px",
                  },
                }}
              />
            </div>
          }
          <div>
            <p className="font-semibold mb-2">سبب الزيارة :</p>
            <AutoResizeTextarea
              name="سبب الزيارة"
              placeholder="أدخل سبب الزيارة هنا"
              style={{ width: "500px" }}
              value={formData.visitReason}
              onChange={(e) =>
                setFormData({ ...formData, visitReason: e.target.value })
              }
              minRows={4}
              maxRows={8}
            />
          </div>
        </div>
        <div className="division buttonDivision">
          <CustomButton name="التسجيل" isInsert={true} onClick={handleSubmit} />
          <CustomButton
            name="الإلغاء"
            onClick={() => {
              // Reset form
              setFormData({
                CIN: "",
                firstName: "",
                lastName: "",
                visitDate: new Date(),
                divisions: [],
                visitReason: "",
              });

              // reset multiselect UI
              if (multiselectRef.current) {
                multiselectRef.current.resetSelectedValues();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VisitDataEntryPage;
