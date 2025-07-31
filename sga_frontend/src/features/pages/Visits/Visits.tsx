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
import { divisionOptions, type Visit } from "../../models/visit";

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
        <input
          key="date-edit"
          type="date"
          defaultValue={new Date(visit.visitDate).toISOString().slice(0, 10)}
          // Add onChange handlers as needed
        />,
        <input
          key="reason-edit"
          type="text"
          defaultValue={visit.visitReason}
          // Add onChange handlers as needed
        />,
        visit.divisions.join(", "), // or a better editable component
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
