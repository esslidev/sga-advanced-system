import { useEffect, useState } from "react";
import { useVisit } from "../../hooks/useVisit";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Visits.css";

import CustomTable, {
  CustomTableAlignment,
  CustomTableTheme,
} from "../../components/common/CustomDataGrid/CustomTable";

import CustomPaginator from "../../components/common/CustomPaginator/CustomPaginator";
import { PagesRoutes } from "../../../AppRoutes";
import { AppUtil } from "../../../core/utils/appUtil";
import {
  Division,
  divisionOptions,
  type DivisionOption,
  type Visit,
} from "../../models/visit";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import AutoResizeTextarea from "../../components/common/CustomTextArea/AutoResizeTextarea";
import Multiselect from "multiselect-react-dropdown";

interface VisitFormData {
  visitDate: Date;
  visitReason: string;
  divisions: Division[];
}

const VisitsPage = () => {
  const {
    visits,
    fetchVisits,
    removeVisit,
    modifyVisit, // Make sure this function exists in your hook
    loading,
    response,
    pagination,
  } = useVisit();

  const [formData, setFormData] = useState<VisitFormData>({
    divisions: [],
    visitDate: new Date(),
    visitReason: "",
  });

  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const visitorId = searchParams.get("visitorId");
  const fullName = searchParams.get("fullName");

  useEffect(() => {
    if (!visitorId) {
      alert("لم يتم تحديد الزائر، سيتم إعادة التوجيه إلى صفحة الزوار");
      navigate(PagesRoutes.visitorsPage);
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId) {
      fetchVisits({ visitorId, limit, page });
    }
  }, [visitorId, limit, page]);

  const header = [
    "رمز التتبع",
    "تاريخ الزيارة",
    "سبب الزيارة",
    "عدد الأقسام",
    "العمليات",
  ];

  const handleDelete = async (id: string) => {
    try {
      await removeVisit({ id });
      alert(response?.message || "تم حذف الزيارة بنجاح");
      fetchVisits({ visitorId: visitorId!, limit, page });
    } catch {
      alert(response?.message || "حدث خطأ أثناء حذف الزيارة");
    }
  };

  const handleEdit = (id: string) => setEditingId(id);

  const handleCancelEdit = () => setEditingId(null);

  const handleSaveEdit = async (updatedVisit: Partial<Visit>) => {
    try {
      await modifyVisit({ id: updatedVisit.id, visitReason: "hello world" });
      console.log(JSON.stringify(updatedVisit, null, 2));
      alert(response?.message || "تم تحديث الزيارة بنجاح");
      setEditingId(null);
      fetchVisits({ visitorId: visitorId!, limit, page });
    } catch {
      alert(response?.message || "حدث خطأ أثناء التحديث");
    }
  };

  const tableCells = visits.map((visit: Visit) => {
    if (visit.id === editingId) {
      // Render editable row cells as React nodes or strings
      return [
        "#" + visit.id.slice(-8).toUpperCase(),
        <div>
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
        </div>,
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
        />,
        <Multiselect
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
              width: "100%",
            },
          }}
        />, // or a better editable component
        <div key="actions" className="actions">
          <button onClick={handleCancelEdit}>إلغاء</button>
          <button onClick={() => handleSaveEdit(visit)}>حفظ</button>
        </div>,
      ];
    } else {
      // Normal read-only row cells
      return [
        "#" + visit.id.slice(-8).toUpperCase(),
        AppUtil.formatDateTimeToArabic(new Date(visit.visitDate)),
        visit.visitReason,
        visit.divisions
          .map(
            (division) =>
              divisionOptions.find((d) => d.value === division)?.label
          )
          .join(", "),
        <div key="actions" className="actions">
          <button
            className="btn btn-primary"
            onClick={() => handleEdit(visit.id)}
          >
            تعديل الزيارة
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(visit.id)}
          >
            حذف
          </button>
        </div>,
      ];
    }
  });

  return (
    <div className="page">
      <h1 className="title">تتبع الزيارات : {fullName || "اسم غير معروف"}</h1>

      {loading && <p>جاري تحميل البيانات...</p>}

      {!loading && visits.length > 0 && (
        <>
          <CustomTable
            headerCells={header}
            cells={tableCells}
            theme={CustomTableTheme.MINIMAL}
            alignment={CustomTableAlignment.LEFT}
            hoverable
            rowColor1="#fff"
            rowColor2="#f9f9f9"
            borderColor="#ccc"
            borderWidth={1}
            padding="12px 16px"
            borderRadius={6}
            headerStyle={{
              color: "#e0e0e0",
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 6,
              textStyle: { fontSize: "16px", fontWeight: "600", color: "#222" },
              alignment: "left",
            }}
          />

          <CustomPaginator
            currentPage={page}
            totalItems={pagination?.total || 0}
            limit={limit}
            onPageChange={({ page }) => setPage(page)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            showPageSizeSelector
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </>
      )}
    </div>
  );
};

export default VisitsPage;
