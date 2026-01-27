import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import LatexEditorMenu from "../components/InnerScreens/MathEditor/LatexEditorMenu";
import { styled } from '@mui/system';
import { ActionButton, latexToPlainText, MenuBox, OPERATION_OPTIONS, STATE_OPTIONS } from "../components/config/fieldConfig";

import SaveIcon from '@mui/icons-material/Save';
import LinkTwoToneIcon from '@mui/icons-material/LinkTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import ReplayTwoToneIcon from '@mui/icons-material/ReplayTwoTone';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom"; // React Router hook
import { MathMLToLaTeX } from "mathml-to-latex";
import { BlockMath } from "react-katex";
import functionPlot from "function-plot";
import nerdamer from "nerdamer";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom"; // If using React Router


export default function DemoUser() {
  const [options, setOptions] = useState(['Default', 'Add New'])
  const [selectedOption1, setSelectedOption1] = useState("Text");
  const [categoryName, setCategoryName] = useState(options[0]);
  const [textFormat, setTextFormat] = useState();
  const [mathContent, setMathContent] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedOpt, setSelectedOpt] = useState('');
  const [result, setResult] = useState('');
  const plotContainerRef = useRef(null);


  const [openDialog, setOpenDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace this with actual auth logic

  const navigate = useNavigate(); // React Router navigation

  const handleAction = (actionMessage) => {
    if (!isAuthenticated) {
      // Show registration modal if not logged in
      setOpenDialog(true);
    } else {
      // If logged in, perform the action normally
      console.log(actionMessage);
    }
  };

  const handleConvertToText = (finalMathML) => {
    console.log("called");

    try {
      // console.log("dsdf",finalMathML);
      let convertedLatex = MathMLToLaTeX.convert(finalMathML);

      // ✅ Remove unnecessary `\left` and `\right`
      convertedLatex = convertedLatex.replace(/\\left\./g, '').replace(/\\right\./g, '');

      // ✅ Fix exponentiation: Convert `\hat<number>` to `^<number>`
      convertedLatex = convertedLatex.replace(/\\hat\s?(\d+)/g, '^$1');

      // ✅ Fix misformatted parentheses
      convertedLatex = convertedLatex.replace(/\\left/g, '').replace(/\\right/g, '');

      // ✅ Remove `\ ` (non-breaking spaces in LaTeX)
      convertedLatex = convertedLatex.replace(/\\ /g, '');

      const textFormate = latexToPlainText(convertedLatex);
      // ✅ Store in sessionStorage
      sessionStorage.setItem("textFormate", textFormate);
      setTextFormat(textFormate);

      return textFormate; // ✅ Now returning the converted text
    } catch (error) {
      console.error('MathML to LaTeX conversion error:', error);
      // setAnchorEl1(null);
      return ""; // Return empty string on error
    }
  };

  useEffect(() => {
    console.log("called");

    let finalMathML = searchParams.get("finalMathML");
    let category = searchParams.get("categoryName");
    let selectedOption = searchParams.get("selectedOption1");
    let selectedOpt = searchParams.get("selectedOption");
    let result = searchParams.get("result");

    if (finalMathML) {
      // ✅ Store in sessionStorage
      sessionStorage.setItem("finalMathML", finalMathML);
      // ✅ Store in sessionStorage
      sessionStorage.setItem("categoryName", category);
      // ✅ Store in sessionStorage
      sessionStorage.setItem("selectedOption", selectedOption);
      // ✅ Store in sessionStorage
      sessionStorage.setItem("selectedOpt", selectedOpt);
      // ✅ Store in sessionStorage
      sessionStorage.setItem("result", result);

      setOptions([...options, category])
      setMathContent(finalMathML);
      setCategoryName(category)
      setSelectedOption1(selectedOption)
      handleConvertToText(finalMathML)
      setSelectedOpt(selectedOpt)
      setResult(result)
      // ✅ Remove the query parameter from the URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      // ✅ Load from sessionStorage when there's no query param
      const storedMathML = sessionStorage.getItem("finalMathML");
      const storedCategoryName = sessionStorage.getItem("categoryName");
      const storedTextFormate = sessionStorage.getItem("textFormate");
      const storedSelectedOpt = sessionStorage.getItem("selectedOpt");
      const storedResult = sessionStorage.getItem("result");
      if (storedMathML) {
        setMathContent(storedMathML);
        setCategoryName(storedCategoryName)
        setTextFormat(storedTextFormate)
        setOptions([...options, storedCategoryName])
        setSelectedOpt(storedSelectedOpt)
        setResult(storedResult)
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedOpt === "Plot" && textFormat) {
      try {
        let expression = textFormat.replace(/\s+/g, "");

        // Check if input is in the form `x = ...`
        if (expression.startsWith("x=")) {
          let xValue = expression.replace("x=", "");

          if (isNaN(xValue)) {
            console.error("Invalid x value:", xValue);
            return;
          }

          functionPlot({
            target: plotContainerRef.current,
            width: 500,
            height: 400,
            yAxis: { label: "y" },
            xAxis: { label: "x" },
            grid: true,
            data: [
              {
                points: [[parseFloat(xValue), -10], [parseFloat(xValue), 10]], // Line from y=-10 to y=10
                fnType: "points",
                graphType: "polyline",
              },
            ],
          });
          return;
        }

        // If not `x = ...`, treat it as a `y = f(x)` function
        let formattedFunction =
          isNaN(expression.replace("y=", "")) ? nerdamer(expression.replace("y=", "")).toString() : `(${expression.replace("y=", "")}) + 0*x`;

        if (!formattedFunction || formattedFunction.includes("undefined")) {
          console.error("Invalid function format:", formattedFunction);
          return;
        }

        functionPlot({
          target: plotContainerRef.current,
          width: 500,
          height: 400,
          yAxis: { label: "y" },
          xAxis: { label: "x" },
          grid: true,
          data: [
            {
              fn: formattedFunction,
              sampler: "builtIn",
              graphType: "polyline",
            },
          ],
        });
      } catch (error) {
        console.error("Error plotting the function:", error);
      }
    }
  }, [searchParams, selectedOpt, textFormat]);

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", p: 2 }}>
      <Typography variant="h5" marginRight={5} p={1}>
        MathEditor
      </Typography>
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4, md: 16 } }}>
        <Box sx={{ flexGrow: 1, backgroundColor: "white", p: { xs: 1, md: 2 } }}>
          {/* Top Toolbar with Menu Boxes */}
          <MenuBox>
            <Grid2 container spacing={1}>
              <LatexEditorMenu
                handlePatternInsert={() => { handleAction("Undo action executed") }}
                isDemo={true}
              />
            </Grid2>
          </MenuBox>

          <Grid2 container spacing={2} sx={{ p: 1 }} className="col-12">
            <Grid2 container spacing={2} sx={{ py: 1, width: "100%" }}>
              <div
                className="output mt-3 shadow-lg"
                style={{
                  minHeight: "50px",
                  maxHeight: "180px",
                  overflowY: "auto",   // Enable vertical scrolling
                  padding: "7px",
                  margin: "0 auto",  // Center the div
                  fontSize: "26.66667px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  width: "100%",      // Make it take full width
                  boxSizing: "border-box", // Ensure padding does not affect width
                }}
                onKeyDown={(e) => {
                  e.preventDefault(); // Prevent user from typing
                  handleAction("User attempted to enter a value");
                }}
                tabIndex={0} // Makes div focusable for key events
                dangerouslySetInnerHTML={{ __html: mathContent }}
              ></div>
            </Grid2>
          </Grid2>

          {/* Bottom Actions */}
          <Grid2
            container
            spacing={1}
            sx={{ mb: 2, p: 1, }}
          >
            <Grid2 item>
              <ActionButton title="Undo" variant="contained" color="primary"
                onClick={() => handleAction("Undo action executed")}
              ><ReplayTwoToneIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton title="Redo" variant="contained" color="primary"
                onClick={() => handleAction("Undo action executed")}
              ><RefreshTwoToneIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton title="copy mathml" variant="contained" color="primary"
                onClick={() => handleAction("Undo action executed")}
              ><CopyAllOutlinedIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={selectedOption1}
                onChange={(e) => handleAction("Undo action executed")}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
                  color: '#fff',
                  '& .MuiOutlinedInput-root': {
                    border: 'none', // Remove the border
                    borderRadius: 4, // Border radius (optional)
                  },
                  '& .MuiSelect-icon': {
                    color: '#fff', // Optional: change the color of the dropdown icon
                  },
                }}
              >
                {STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 item>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={categoryName}
                onChange={(e) => handleAction("Undo action executed")}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
                  color: '#fff',
                  '& .MuiOutlinedInput-root': {
                    border: 'none', // Remove the border
                    borderRadius: 4, // Border radius (optional)
                  },
                  '& .MuiSelect-icon': {
                    color: '#fff', // Optional: change the color of the dropdown icon
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 item>
              <ActionButton
                title="Save to file"
                variant="contained"
                color="primary"
                onClick={() => handleAction("Undo action executed")}
              >
                <SaveIcon fontSize="small" />
              </ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton variant="contained"
                onClick={() => handleAction("Undo action executed")}
              >Load form file</ActionButton>
            </Grid2>

            <Grid2 item>
              <Select
                defaultChecked={OPERATION_OPTIONS[0]}
                inputProps={{ "aria-label": "Without label" }}
                value={selectedOpt}
                onChange={(e) => handleAction("Undo action executed")}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
                  color: '#fff',
                  '& .MuiOutlinedInput-root': {
                    border: 'none', // Remove the border
                    borderRadius: 4, // Border radius (optional)
                  },
                  '& .MuiSelect-icon': {
                    color: '#fff', // Optional: change the color of the dropdown icon
                  },
                }}
              >
                <MenuItem value="Solve">
                  <em>Solve</em>
                </MenuItem>

                {OPERATION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 item>
              <ActionButton variant="contained"
                onClick={() => handleAction("Undo action executed")}
              >Submit</ActionButton>
            </Grid2>
          </Grid2>

          {/* Bottom texarea2 */}
          <Grid2 container spacing={2} sx={{ p: 1 }}>
            <div
              style={{
                width: "100%",
                minHeight: "50px",
                maxHeight: "100px",
                overflow: "auto",
                padding: "8px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                fontSize: "16px",
                whiteSpace: "pre-wrap", // ✅ Preserves line breaks
              }}
              onKeyDown={(e) => {
                e.preventDefault(); // Prevent user from typing
                handleAction("User attempted to enter a value");
              }}
              tabIndex={0} // Makes div focusable for key events
            >
              {textFormat || "No content available"}
            </div>
          </Grid2>

          {/* Render the plot or result*/}
          <Grid2
            container
            sx={{ p: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Grid2 item sx={{ textAlign: "center", width: "100%" }}>
              {selectedOpt === "Plot" ? (
                <Box sx={{ width: "100%", maxWidth: "800px", overflowX: "auto" }}>
                  <div
                    ref={plotContainerRef}
                    style={{ width: "100%", height: "auto", minHeight: "300px" }}
                  />
                </Box>
              ) : (
                <BlockMath>{result}</BlockMath>
              )}
            </Grid2>
          </Grid2>

          {/* Registration Modal */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                minWidth: { xs: "90vw", sm: "400px" }, // Responsive min width
              },
            }}
          >
            {/* Dialog Title with Close Button */}
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Register to Continue
              </Typography>
              <IconButton onClick={() => setOpenDialog(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
              <Typography variant="body1" sx={{ color: "#555" }}>
                You need to <strong>register</strong> or <strong>log in</strong> to continue.
              </Typography>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ justifyContent: "flex-end", gap: 1, pb: 2, pr: 3 }}>
              <Button
                onClick={() => navigate("/register")}
                variant="contained"
                sx={{
                  backgroundColor: "#002855",
                  color: "white",
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  "&:hover": { backgroundColor: "#004aad" },
                }}
              >
                REGISTER
              </Button>
              <Button
                onClick={() => navigate("/sign_in")}
                variant="outlined"
                sx={{
                  borderColor: "#ff00aa",
                  color: "#ff00aa",
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  "&:hover": { backgroundColor: "#ff00aa", color: "white" },
                }}
              >
                LOGIN
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
