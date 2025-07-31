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
import VisitRow from "./components/VisitRow";

const VisitsPage = () => {
  const {
    visits,
    fetchVisits,
    removeVisit,
    modifyVisit,
    loading,
    response,
    pagination,
  } = useVisit();

  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

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

  const handleUpdate = async () => {};

  const handleDelete = async (id: string) => {
    try {
      await removeVisit({ id });
      alert(response?.message || "تم حذف الزيارة بنجاح");
      fetchVisits({ visitorId: visitorId!, limit, page });
    } catch {
      alert(response?.message || "حدث خطأ أثناء حذف الزيارة");
    }
  };

  const handleSaveEdit = async (updatedVisit: any) => {
    try {
      await modifyVisit(updatedVisit);
      alert("تم تحديث الزيارة بنجاح");
      fetchVisits({ visitorId: visitorId!, limit, page });
    } catch {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const tableRows = visits.map((visit) => {
    return VisitRow({
      visit,
      onDelete: handleDelete,
      onUpdate: handleSaveEdit,
    });
  });
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
