import { GridActionsCellItem } from "@mui/x-data-grid";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import { Typography } from "@mui/material";

const MathEditorColumns = (handleEdit, handleDelete, handleShare) => {
  return [
    {
      field: "siNo",
      headerName: "SI.NO",
      align: "center",
      headerAlign: "center",
      width: 90,
    },
    {
      field: "formula",
      headerName: "Formula",
      width: 350,
      renderCell: (params) => (
        <div
          dangerouslySetInnerHTML={{ __html: params.value }}
          style={{ display: "flex", alignItems: "center" }}
        />
      ),
    },
    {
      field: "formulaName",
      headerName: "Formula Name",
      width: 200,
    },
    {
      field: "formulaUrl",
      headerName: "Formula Url",
      width: 220,
      renderCell: (params) => (
        <Typography
          variant="body2"
          title={params.value} // ✅ Native Tooltip for Full URL
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "tinyUrl",
      headerName: "Tiny Url",
      width: 220,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      align: "left",
      headerAlign: "left",
      cellClassName: "actions",
      width: 120,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditTwoToneIcon />}
            label="Edit"
            color="primary"
            onClick={handleEdit(id)}
            title="Edit"
          />,
          <GridActionsCellItem
            icon={<DeleteTwoToneIcon />}
            label="Delete"
            color="error"
            onClick={handleDelete(id)}
            title="Delete"
          />,
          <GridActionsCellItem
            icon={<ShareTwoToneIcon />}
            label="Share"
            color="secondary"
            onClick={handleShare(id)}
            title="Share"
          />,
        ];
      },
    },
  ];
};

export default MathEditorColumns;
