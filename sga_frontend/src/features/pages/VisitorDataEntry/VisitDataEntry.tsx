import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { useVisit } from "../../hooks/useVisit";
import {
  Division,
  divisionOptions,
  type DivisionOption,
  type Visit,
} from "../../models/visit";

import "./VisitDataEntry.css";
import Multiselect from "multiselect-react-dropdown";
import AutoResizeTextarea from "../../components/common/CustomTextArea/AutoResizeTextarea";
import { t } from "../../../core/utils/translator";
import { useSystemPreferences } from "../../hooks/useSystemPreferences";
import CustomTextInput from "../../components/common/TextInput/CustomTextInput";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { Calendar, Clock, UserCircle } from "lucide-react";
import { Button } from "react-bootstrap";

const VisitDataEntryPage = () => {
  const { language } = useSystemPreferences();
  const { createVisit, loading, response } = useVisit();

  const multiselectRef = useRef<Multiselect>(null);
  const [CIN, setCIN] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [visitReason, setVisitReason] = useState<string>("");

  useEffect(() => {
    if (response && response.statusCode >= 200 && response.statusCode < 300) {
      alert("تم تسجيل الزيارة بنجاح!");
      // Reset form
      setCIN("");
      setFirstName("");
      setLastName("");
      setVisitDate(new Date());
      setDivisions([]);
      setVisitReason("");

      if (multiselectRef.current) {
        multiselectRef.current.resetSelectedValues();
      }
    }
  }, [response]);

  const handleSubmit = async () => {
    if (
      !CIN.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !visitReason?.trim() ||
      divisions.length === 0 ||
      visitDate.toString() === "Invalid Date"
    ) {
      return;
    }

    const visitPayload: Partial<Visit> & {
      visitor: { CIN: string; firstName: string; lastName: string };
    } = {
      visitor: { CIN, firstName, lastName },
      visitDate,
      divisions,
      visitReason,
    };

    await createVisit(visitPayload);
  };

  return (
    <div className="visit-data-entry-container container-fluid d-flex flex-column justify-content-center align-items-center g-0 vh-100">
      <div className="form-container d-flex flex-column gap-4">
        <div className="form-title d-flex flex-column gap-2">
          <h1 className="title">{t("pages.visitDataEntry.title", language)}</h1>
          <p className="subtitle">
            {t("pages.visitDataEntry.subtitle", language)}
          </p>
        </div>

        <div className="form-inputs row g-4">
          {/* CIN */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.cin", language)}
              value={CIN.trim()}
              onChange={(val) => setCIN(val.toUpperCase())}
              placeholder="XX000000"
              icon={<IdentificationIcon />}
              onEnter={handleSubmit}
            />
          </div>

          {/* First Name */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.firstName", language)}
              value={firstName}
              onChange={setFirstName}
              placeholder={t(
                "pages.visitDataEntry.firstNamePlaceholder",
                language
              )}
              icon={<UserCircle />}
            />
          </div>

          {/* Last Name */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.lastName", language)}
              value={lastName}
              onChange={setLastName}
              placeholder={t(
                "pages.visitDataEntry.lastNamePlaceholder",
                language
              )}
              icon={<UserCircle />}
            />
          </div>

          {/* Visit Date */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.visitDate", language)}
              type="date"
              value={visitDate.toISOString().split("T")[0]}
              onChange={(value) => {
                const newDate = new Date(visitDate);
                const [year, month, day] = value.split("-").map(Number);
                newDate.setFullYear(year, month - 1, day);
                setVisitDate(newDate);
              }}
              icon={<Calendar />}
            />
          </div>

          {/* Visit Time */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.visitTime", language)}
              type="time"
              value={visitDate.toTimeString().substring(0, 5)}
              onChange={(value) => {
                const newDate = new Date(visitDate);
                const [hours, minutes] = value.split(":").map(Number);
                newDate.setHours(hours, minutes);
                setVisitDate(newDate);
              }}
              icon={<Clock />}
            />
          </div>

          {/* Division */}
          <div className="col-12 col-md-6">
            <Multiselect
              ref={multiselectRef}
              className="custom-multiselect"
              options={divisionOptions.map((option) => ({
                name: option.label,
                value: option.value,
              }))}
              displayValue="name"
              placeholder={t(
                "pages.visitDataEntry.departementPlaceholder",
                language
              )}
              emptyRecordMsg={t(
                "pages.visitDataEntry.unavailableDepartementPlaceholder",
                language
              )}
              onSelect={(selected: DivisionOption[]) =>
                setDivisions(selected.map((s) => s.value as Division))
              }
              onRemove={(selected: DivisionOption[]) =>
                setDivisions(selected.map((s) => s.value as Division))
              }
              isObject={true}
            />
          </div>

          {/* Visit Reason */}
          <div className="col-12 col-md-6">
            <AutoResizeTextarea
              name="سبب الزيارة"
              placeholder="أدخل سبب الزيارة هنا"
              style={{ width: "100%" }}
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              minRows={4}
              maxRows={8}
            />
          </div>
        </div>
        {response && response.statusCode >= 400 && (
          <p className="error-response">{response.message}</p>
        )}
        <div className="divisions mt-4 d-flex gap-3">
          <Button
            type="submit"
            className="visit-form-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading
              ? t("pages.visitDataEntry.submitLoading", language)
              : t("pages.visitDataEntry.submit", language)}
          </Button>
          <Button
            className="visit-form-btn"
            disabled={loading}
            onClick={() => {
              setCIN("");
              setFirstName("");
              setLastName("");
              setVisitDate(new Date());
              setDivisions([]);
              setVisitReason("");
              if (multiselectRef.current)
                multiselectRef.current.resetSelectedValues();
            }}
          >
            {t("pages.visitDataEntry.cancel", language)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitDataEntryPage;
