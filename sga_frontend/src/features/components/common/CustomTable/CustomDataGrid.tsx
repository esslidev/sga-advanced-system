import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import "./CustomDataGrid.css";

const columns = [
  {
    field: "cin",
    headerName: "cin",
    width: 70,
    cellClassName: "first-column-cell",
  },
  { field: "first_name", headerName: "الاسم", width: 130 },
  { field: "last_name", headerName: "النسب", width: 90 },
];

const rows = [
  { cin: 1, first_name: "Alice", last_name: 25 },
  { cin: 2, first_name: "Bob", last_name: 30 },
  { cin: 3, first_name: "Charlie", last_name: 28 },
  { cin: 4, first_name: "David", last_name: 33 },
];

export default function MyDataGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <Box sx={{ height: 400, width: "100%" }} dir="rtl">
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.cin}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ boxShadow: "10px" }}
      />
    </Box>
  );
}
