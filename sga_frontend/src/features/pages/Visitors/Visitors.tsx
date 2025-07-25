import { useEffect, useState, useCallback } from "react";
import { useVisitor } from "../../hooks/useVisitor";
import "./Visitors.css";

import CustomTable, {
  CustomTableAlignment,
  CustomTableTheme,
} from "../../components/common/CustomDataGrid/CustomTable";

import CustomPaginator from "../../components/common/CustomPaginator/CustomPaginator";
import { AppUtil } from "../../../core/utils/appUtil";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { PagesRoutes } from "../../../AppRoutes";

const VisitorsPage = () => {
  const navigate = useNavigate();

  const {
    visitors,
    fetchVisitors,
    removeVisitor,
    loading,
    response,
    pagination,
  } = useVisitor();

  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);

  const header = [
    "رمز التتبع",
    "رقم البطاقة الوطنية",
    "الإسم الشخصي",
    "الإسم العائلي",
    "تاريخ الانشاء",
    "عدد الزيارات",
    "العمليات",
  ];

  // Fetch visitors when pagination or search changes
  useEffect(() => {
    fetchVisitors({ limit, page, search });
  }, [limit, page, search]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleSearchInput = (value: string) => {
    debouncedSearch(value);
  };
  const goToVisits = (visitor: {
    id: string;
    firstName: string;
    lastName: string;
  }) => {
    const fullName = `${visitor.firstName} ${visitor.lastName}`;
    const encodedFullName = encodeURIComponent(fullName);
    const encodedId = encodeURIComponent(visitor.id);

    navigate(
      `${PagesRoutes.visitsPage}?visitorId=${encodedId}&fullName=${encodedFullName}`
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await removeVisitor({ id });
      alert(response?.message || "تم حذف الزائر بنجاح");
      fetchVisitors({ limit, page, search });
    } catch {
      alert(response?.message || "حدث خطأ أثناء حذف الزائر");
    }
  };

  const tableRows = visitors.map((visitor) => [
    <p dir="ltr" key={`${visitor.id}-id`}>
      {"#" + visitor.id.slice(-8).toUpperCase()}
    </p>,
    <p dir="ltr" key={`${visitor.CIN}-cin`}>
      {visitor.CIN.toUpperCase()}
    </p>,
    <p key={`${visitor.firstName}-firstName`}>{visitor.firstName}</p>,
    <p key={`${visitor.lastName}-lastName`}>{visitor.lastName}</p>,
    <p key={`${visitor.createdAt}-createdAt`}>
      {AppUtil.formatDateToArabic(new Date(visitor.createdAt))}
    </p>,
    <p key={`${visitor.CIN}-visits`}>{visitor.visitsCount} زيارة</p>,
    <div key={`${visitor.id}-actions`} className="actions">
      <button className="btn btn-primary" onClick={() => goToVisits(visitor)}>
        تتبع الزيارات
      </button>
      <button
        className="btn btn-danger"
        onClick={() => handleDelete(visitor.id)}
      >
        حذف
      </button>
    </div>,
  ]);

  return (
    <div className="page">
      <h1 className="title">تتبع التحصيل</h1>

      {loading && <p>جاري تحميل البيانات...</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="البحث عن زائر..."
          onChange={(e) => handleSearchInput(e.target.value)}
        />
      </div>

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
    </div>
  );
};

export default VisitorsPage;
