import { useCallback, useEffect, useRef, useState } from "react";
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
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { Calendar, Clock, UserCircle } from "lucide-react";
import { Button } from "react-bootstrap";
import { useVisitor } from "../../hooks/useVisitor";
import debounce from "lodash.debounce";

const VisitDataEntryPage = () => {
  const { language } = useSystemPreferences();
  const {
    createVisit,
    loading: visitLoading,
    response: visitResponse,
  } = useVisit();

  const {
    visitor,
    fetchVisitor,
    loading: visitorLoading,
    response: visitorResponse,
  } = useVisitor();

  const multiselectRef = useRef<Multiselect>(null);
  const [CIN, setCIN] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [visitReason, setVisitReason] = useState<string>("");

  // Reset form after successful submission
  useEffect(() => {
    if (
      visitResponse &&
      visitResponse.statusCode >= 200 &&
      visitResponse.statusCode < 300
    ) {
      alert("تم تسجيل الزيارة بنجاح!");
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
  }, [visitResponse]);

  // Debounced visitor search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchVisitor({ CIN: value });
    }, 500),
    []
  );

  const handleCheckVisitor = (value: string) => {
    debouncedSearch(value);
  };

  const handleSubmit = async () => {
    const effectiveFirstName = visitor ? visitor.firstName : firstName;
    const effectiveLastName = visitor ? visitor.lastName : lastName;

    if (
      !CIN.trim() ||
      !effectiveFirstName?.trim() ||
      !effectiveLastName?.trim() ||
      !visitReason?.trim() ||
      divisions.length === 0 ||
      visitDate.toString() === "Invalid Date"
    ) {
      return;
    }

    const visitPayload: Partial<Visit> & {
      visitor: { CIN: string; firstName: string; lastName: string };
    } = {
      visitor: {
        CIN,
        firstName: effectiveFirstName,
        lastName: effectiveLastName,
      },
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
          <div className="col-12 col-md-12 d-flex flex-column gap-3">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.cin", language)}
              value={CIN.trim()}
              onChange={(value) => {
                setCIN(value.toUpperCase());
                handleCheckVisitor(value);
              }}
              placeholder="XX000000"
              icon={<IdentificationIcon />}
              onEnter={handleSubmit}
            />
            {visitor && (
              <p className="visitor-found">
                {t("pages.visitDataEntry.visitorFound", language)}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="col-12 col-md-6">
            <CustomTextInput
              className="input"
              label={t("pages.visitDataEntry.firstName", language)}
              value={visitor ? visitor.firstName : firstName}
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
              value={visitor ? visitor.lastName : lastName}
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
              placeholder={t(
                "pages.visitDataEntry.visitReasonPlaceholder",
                language
              )}
              style={{ width: "100%" }}
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              minRows={6}
              maxRows={10}
            />
          </div>
        </div>

        {visitResponse && visitResponse.statusCode >= 400 && (
          <p className="error-response">{visitResponse.message}</p>
        )}

        <div className="divisions mt-4 d-flex gap-3">
          <Button
            type="submit"
            className="visit-form-btn"
            disabled={visitLoading}
            onClick={handleSubmit}
          >
            {visitLoading
              ? t("pages.visitDataEntry.submitLoading", language)
              : t("pages.visitDataEntry.submit", language)}
          </Button>
          <Button
            className="visit-form-btn cancel"
            disabled={visitLoading}
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
