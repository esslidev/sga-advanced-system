import { useEffect, useState } from "react";
import { useVisit } from "../../hooks/useVisit"; // your hook
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Visits.css";

import CustomTable, {
  CustomTableAlignment,
  CustomTableTheme,
} from "../../components/common/CustomDataGrid/CustomTable";

import CustomPaginator from "../../components/common/CustomPaginator/CustomPaginator";
import { AppUtil } from "../../../core/utils/appUtil";
import { PagesRoutes } from "../../../AppRoutes";
import { divisionOptions } from "../../models/visit";

const VisitsPage = () => {
  const { visits, fetchVisits, removeVisit, loading, response, pagination } =
    useVisit();

  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const visitorId = searchParams.get("visitorId");
  const fullName = searchParams.get("fullName");

  // Redirect back if no visitorId found to prevent errors
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
    "رقم التتبع",
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

  const tableRows = visits.map((visit) => [
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
      <button className="btn btn-primary">تعديل الزيارة</button>
      <button className="btn btn-danger" onClick={() => handleDelete(visit.id)}>
        حذف
      </button>
    </div>,
  ]);

  return (
    <div className="page">
      <h1 className="title">تتبع الزيارات : {fullName || "اسم غير معروف"}</h1>

      {loading && <p>جاري تحميل البيانات...</p>}

      {!loading && visits.length > 0 && (
        <>
          <CustomTable
            headerCells={header}
            cells={tableRows}
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
