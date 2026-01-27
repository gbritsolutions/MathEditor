import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const MatrixDialog = ({ open, onClose, onInsert }) => {
  const [rows, setRows] = useState(3); // Default value for rows
  const [cols, setCols] = useState(3); // Default value for columns
  const [matrixBracket, setMatrixBracket] = useState('{□}'); // Default bracket type

const handleInsert = () => {
    let matrixMathML = '<mrow>';
  
    // Handle different bracket types
    switch (matrixBracket) {
      case '□':
        // No brackets
        break;
      case '[□]':
        matrixMathML += '<mo>[</mo>';
        break;
      case '(□)':
        matrixMathML += '<mo>(</mo>';
        break;
      case '|□|':
        matrixMathML += '<mo>|</mo>';
        break;
      case '{□}':
        matrixMathML += '<mo>{</mo>';
        break;
      default:
        break;
    }
  
    // Create the matrix inside <mtable>
    matrixMathML += '<mtable>';
  
    // Loop through each row
    for (let i = 0; i < rows; i++) {
      matrixMathML += '<mtr>';
  
      // Loop through each column in the current row
      for (let j = 0; j < cols; j++) {
        matrixMathML += `<mtd><mi>&square;</mi></mtd>`;
      }
  
      matrixMathML += '</mtr>';
    }
    
    matrixMathML += '</mtable>';
  
    // Close the bracket based on the selection
    switch (matrixBracket) {
      case '[□]':
        matrixMathML += '<mo>]</mo>';
        break;
      case '(□)':
        matrixMathML += '<mo>)</mo>';
        break;
      case '|□|':
        matrixMathML += '<mo>|</mo>';
        break;
      case '{□}':
        matrixMathML += '<mo>}</mo>';
        break;
      default:
        break;
    }
  
    matrixMathML += '</mrow>';
  
    // Insert the generated MathML into the editor
    onInsert(matrixMathML);
  
    onClose(); // Close the dialog after insertion
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Insert Matrix</DialogTitle>
      <DialogContent>
        <TextField
          label="Rows"
          type="number"
          fullWidth
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Columns"
          type="number"
          fullWidth
          value={cols}
          onChange={(e) => setCols(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Matrix Bracket</InputLabel>
          <Select
            value={matrixBracket}
            onChange={(e) => setMatrixBracket(e.target.value)}
            label="Matrix Bracket"
          >
            <MenuItem value="□">□</MenuItem>
            <MenuItem value="(□)">{`(□)`}</MenuItem>
            <MenuItem value="{□}">{`{□}`}</MenuItem>
            <MenuItem value="|□|">{`|□|`}</MenuItem>
            <MenuItem value="[□]">{`[□]`}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleInsert}>OK</button>
      </DialogActions>
    </Dialog>
  );
};

export default MatrixDialog;
