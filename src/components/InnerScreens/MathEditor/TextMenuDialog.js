import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CropSquareTwoToneIcon from '@mui/icons-material/CropSquareTwoTone';


import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { Grid2, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { TEXT_MENU_LABEL } from "../../config/fieldConfig";

const ActionButton = styled(Button)(() => ({
  ":hover": { backgroundImage: 'linear-gradient(to left, #0C2A51, #365F8C)', },
  backgroundColor: '#365F8C',
  borderRadius: 4,
  fontSize: 11
}));

const TextMenuDialog = ({ menuName, onClose, onInsert }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [textValue, setTextValue] = useState("");

  const handleOk = () => {
    console.log("Entered Text:", textValue);
    onInsert(textValue); // Insert the text into the editor
    setIsDialogOpen(false);
    onClose();
  };

  return (
    <Dialog open={isDialogOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: "linear-gradient(to right, #0C2A51, #365F8C)",
          color: "#fff",
        }}
      >
        {menuName === TEXT_MENU_LABEL ? "Text" : "TeX/LaTeX"}
      </DialogTitle>
      <DialogContent sx={{ mt: "10px" }}>
        <Typography sx={{ fontFamily: "Times New Roman, serif", color: "#00838f", mb: "8px" }}>
          {menuName === TEXT_MENU_LABEL ? "Enter Text" : "Enter TeX/LaTeX input:"}
        </Typography>
        <TextareaAutosize
          minRows={3}
          placeholder="ABCabc..."
          style={{
            width: "100%",
            borderRadius: "3px",
            border: "1px solid #ccc",
            fontSize: 12,
          }}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <ActionButton onClick={onClose} variant="contained" color="primary" size="small">
          Cancel
        </ActionButton>
        <ActionButton onClick={handleOk} variant="contained" size="small" color="primary">
          OK
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default TextMenuDialog;
