import { Box, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EmptyBox from "../../common/EmptyBox";
import CustomPagination from "../../common/CustomPagination";
import MathEditorColumns from "./columns";
import MathEditorToolbar from "./toolbar";
import { MathEditorService } from "../../service/mathEditorService";
import Frame1 from "./frame1";
import { useEffect, useState } from "react";

export default function MathEditor() {
  const {
    rows,
    mode,
    editItemId,
    editFormData,
    onAddForm,
    onEditForm,
    handleEdit,
    handleDelete,
    handleShare,
    sendDataToIframe,
    setMode,
    input,
    setInput
  } = MathEditorService();

  // ✅ Store density in state
  const [density, setDensity] = useState("compact");

  const columns = MathEditorColumns(handleEdit, handleDelete, handleShare);

  return (
    <>
      {/* Editor Display for both add and edit */}
      <Frame1
        mode={mode}
        editItemId={editItemId}
        editFormData={editFormData}
        onAddForm={onAddForm}
        onEditForm={onEditForm}
        sendDataToIframe={sendDataToIframe}
        setMode={setMode}
        input={input}
        setInput={setInput}
        rows={rows}
      />
      <Box
        sx={{
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            noRowsOverlay: EmptyBox,
            toolbar: MathEditorToolbar,
            pagination: CustomPagination,
            loadingOverlay: LinearProgress,
          }}
          density={density}
          onDensityChange={(newDensity) => setDensity(newDensity)}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          getRowHeight={() => 'auto'}
          sx={{
            boxShadow: 5,
            margin: 2,
            padding: 2,
            height: 500,
            "& .MuiDataGrid-row": {
              minHeight: "inherit", // ✅ Ensure row takes the correct height
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center", // ✅ Ensure content is centered
            },
          }}
        />
      </Box>
    </>
  );
}