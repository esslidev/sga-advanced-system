import { useEffect, useState } from "react";
import { useVisitor } from "../../hooks/useVisitor";
import "./Visitors.css";
import CustomTable, {
  CustomTableAlignment,
  CustomTableTheme,
} from "../../components/common/CustomDataGrid/CustomTable";
import { AppUtil } from "../../../core/utils/appUtil";
import CustomPaginator from "../../components/common/CustomPaginator/CustomPaginator";

const VisitorsPage = () => {
  const {
    visitors,
    fetchVisitors,
    removeVisitor,
    loading,
    response,
    pagination,
  } = useVisitor();

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const header = [
    "رقم البطاقة الوطنية",
    "الإسم الشخصي",
    "الإسم العائلي",
    "تاريخ الانشاء",
    "عدد الزيارات",
    "العمليات",
  ];

  useEffect(() => {
    fetchVisitors({ limit, page });
  }, [limit, page]);

  const handleDelete = (id: string) => {
    removeVisitor({ id })
      .then(() => {
        alert(response?.message || "تم حذف الزائر بنجاح");
        fetchVisitors({ limit, page });
      })
      .catch(() => {
        alert(response?.message || "حدث خطأ أثناء حذف الزائر");
      });
  };

  return (
    <div className="page">
      <h1 className="title">تتبع التحصيل</h1>

      {loading && <p>جاري تحميل البيانات...</p>}

      <CustomTable
        headerCells={header}
        theme={CustomTableTheme.MINIMAL}
        alignment={CustomTableAlignment.LEFT}
        hoverable={true}
        cells={visitors.map((visitor) => [
          <p key={visitor.CIN + "-CIN"}>{visitor.CIN}</p>,
          <p key={visitor.firstName + "-firstName"}>{visitor.firstName}</p>,
          <p key={visitor.lastName + "-lastName"}>{visitor.lastName}</p>,
          <p key={visitor.CIN + "-createdAt"}>
            {AppUtil.formatDateToArabic(new Date(visitor.createdAt))}
          </p>,
          <p key={visitor.CIN + "-visits"}>{0} زيارة</p>,
          <div key={visitor.CIN + "-actions"} className="actions">
            <button className="btn btn-primary">تتبع الزيارات</button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(visitor.id)}
            >
              حذف
            </button>
          </div>,
        ])}
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
      <div>
        <CustomPaginator
          currentPage={page}
          totalItems={pagination?.total || 10}
          limit={limit}
          onPageChange={(params) => {
            setPage(params.page || 1);
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
};

export default VisitorsPage;
