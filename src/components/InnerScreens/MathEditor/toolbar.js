import { Typography } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

export default function MathEditorToolbar() {
  return (
    <>
      <GridToolbarContainer>
        <Typography variant="h5" color="primary" marginRight={5}>
          Math Editor
        </Typography>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <div style={{ flex: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    </>
  );
}
