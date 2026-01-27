import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormLabel, Grid, Grid2, IconButton, InputAdornment, Menu, MenuItem, Paper, Popover, RadioGroup, Select, TextareaAutosize, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import CopyAllTwoToneIcon from '@mui/icons-material/CopyAllTwoTone';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import 'mathlive';
import { cleanMathML, enforceMathMLStructure, excludedElements, fixMiWrapping, handleCopyLink, handleDownload, handleFileUpload, LATEX_MENU_LABEL, latexToPlainText, OPERATION_OPTIONS, SYMBOLS, SYMBOLS2, TEXT_MENU_LABEL } from "../../config/fieldConfig";

import { styled } from '@mui/system';
import LZString from 'lz-string'; // Import LZString for compression
import { MathJax, MathJaxContext } from "better-react-mathjax"; // Import MathJax

import { MathMLToLaTeX } from 'mathml-to-latex';
import LatexEditorMenu from "./LatexEditorMenu";
import functionPlot from 'function-plot';

import nerdamer from "nerdamer";
import "nerdamer/Algebra.js"; // Import algebra support for nerdamer
import "nerdamer/Solve.js";   // Import the solver
import "nerdamer/Calculus.js"; // Import calculus functions (differentiation and integration)

const MenuBoxItem = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to bottom, #0C2A51, #365F8C)',
  borderRadius: '8px',
  padding: theme.spacing(1),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
  color: '#fff',
}));

const MenuBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to top, #0C2A51, #365F8C)',
  borderRadius: '3px',
  padding: theme.spacing(1),
  fontFamily: "Times New Roman, serif", // Ensure proper font family

  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#365F8C', borderRadius: 4, fontSize: 11
}));

const Frame = ({
  mode,
  editItemId,
  editFormData,
  onAddForm,
  onEditForm,
  sendDataToIframe,
  setMode,
  input,
  setInput
}) => {
  const { handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [latexMathCon, setLatexMathCon] = useState();
  const [updatedMathMl, setUpdatedMathMl] = useState();
  const [textFormat, setTextFormat] = useState();


  const [latexMathCons, setLatexMathCons] = useState();
  const [options, setOptions] = useState(['Default', 'Add New'])

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(options[0]);
  const [numberValue, setNumberValue] = useState(0); // Track the number value

  const [encodMathMl, setEncodMathMl] = useState({})

  const mathContainerRef = useRef(null);  // Reference to editable MathML container

  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState("");

  const plotContainerRef = useRef(null);

  // Create a ref for editItemId
  const editItemIdRef = useRef(editItemId);

  const [state, setState] = useState(""); // Tracks current MathML content
  const undoStack = useRef([]); // Stores past states for undo
  const redoStack = useRef([]); // Stores undone states for redo

  // Handle MathJax Loading Error
  const [mathJaxError, setMathJaxError] = useState(false);

  const handleMathJaxError = (error) => {
    try {
      setMathJaxError(true); // Stop rendering MathJax if it fails
    } catch (error) {
      console.error("MathJax failed to load:", error);
    }
  };

  //automaticaly focused the editable area
  useEffect(() => {
    if (mathContainerRef.current) {
      mathContainerRef.current.focus();
    }
  }, []);

  const handleClickOutside = (event) => {
    const mathContainer = mathContainerRef.current;
    const clickedElement = event.target;

    const isExcludedClick = excludedElements.some((selector) => {
      return clickedElement.closest(selector);
    });

    if (mathContainer && !mathContainer.contains(clickedElement) && !isExcludedClick) {
      mathContainer.focus();
    }
  };

  //automaticaly focused the editable area if click outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Update the ref whenever editItemId changes
    editItemIdRef.current = editItemId;
  }, [editItemId]);

  useEffect(() => {
    // Event listener for messages from iframe
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        // Optionally, add security check here
        return;
      }

      if (event?.data.type === "submit") {
        // Get the values
        const { formula, formulaName, mode } = event.data;

        onSubmit(formula, formulaName, mode);
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define onSubmit function
  const onSubmit = (formula, formulaName) => {
    console.log("latexMathCons", latexMathCons);
    console.log("latexMathCon", latexMathCon);
    console.log("updatedMathMl", updatedMathMl);


    const finalData = {
      formula: updatedMathMl,
      formulaName: categoryName, // Use the received formula name
      formulaUrl: "https://algebra/F",
      tinyUrl: "https://tinyurl.com/app",
    };

    console.log(finalData);

    if (mode === "add") {
      onAddForm(finalData);
    } else if (mode === "edit") {
      finalData.id = editItemIdRef.current;
      onEditForm(finalData);
      setMode("add"); // Change mode to "add" after submitting in "edit" mode
    }
    setResult("")
    setSelectedOption("")
  };

  // Effect to update the editor content when a row is selected
  useEffect(() => {
    if (mathContainerRef.current && editFormData.formula) {
      // Set the content first
      mathContainerRef.current.innerHTML = `&nbsp;${editFormData.formula}&nbsp;`; // Add non-breaking spaces

      // Apply styles to mathematical elements for proper alignment
      ['mi', 'mo'].forEach((selector) => {
        mathContainerRef.current.querySelectorAll(selector).forEach((element) => {
          element.style.display = 'inline-flex';
          element.style.alignItems = 'center';
        });
      });

    }
  }, [editFormData]); // Runs when editFormData changes

  const handleMenuOpen = (e, menuId) => {
    console.log(menuId, e.currentTarget);
    if (menuId === "menu3") {
      setAnchorEl(e.currentTarget);
      setAnchorEl1(e.currentTarget)
    }
  };

  const handleClose = (menuId) => {
    setAnchorEl(null);
    setAnchorEl1(null)
    setOpen(false);
  };

  const handleMenuClose = (format) => {
    setAnchorEl(null);
    setAnchorEl1(null)
  };

  const handleDeleteClick = () => {
    if (!categoryName || !encodMathMl[categoryName]) {
      console.log("No category selected or no data to delete.");
      return;
    }

    console.log("Before delete:", encodMathMl);

    // Remove the selected item (based on numberValue) from the array
    const updatedCategoryItems = encodMathMl[categoryName].filter(
      (_, index) => index !== numberValue - 1 // Remove the selected index
    );

    // Create a new state object with the updated category array
    const updatedState = {
      ...encodMathMl,
      [categoryName]: updatedCategoryItems.length > 0 ? updatedCategoryItems : undefined, // Remove category if empty
    };

    // Remove empty categories
    if (updatedCategoryItems.length === 0) {
      delete updatedState[categoryName];
    }

    console.log("After delete:", updatedState);

    // Update state and localStorage
    setEncodMathMl(updatedState);
    localStorage.setItem("mathmlifyx", JSON.stringify(updatedState));

    // Reset number input if the deleted item was the last one
    setNumberValue(Math.max(1, updatedCategoryItems.length));
  };

  const handleNumberChange = (event) => {

    const newValue = event.target.value;
    const lastEncodedMathML = encodMathMl[categoryName][newValue - 1]; // Assuming the last item is the one you want to decode

    // Check length of the encoded MathML array for the selected category
    if (lastEncodedMathML) {
      // Decode the last MathML item from the array
      const decodedMathML = LZString.decompressFromEncodedURIComponent(lastEncodedMathML);
      // insertMathML(decodedMathML)
      if (mathContainerRef.current) {
        mathContainerRef.current.innerHTML = `&nbsp;${decodedMathML}&nbsp;`; // Add non-breaking spaces

        // Apply styles to mathematical elements for proper alignment
        ['mi', 'mo'].forEach((selector) => {
          mathContainerRef.current.querySelectorAll(selector).forEach((element) => {
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
          });
        });
      }
      setUpdatedMathMl(decodedMathML)
      setNumberValue(newValue); // Update state
    } else {
      console.log("No MathML data for the selected category.");
    }

  };

  const handleSelectChange = (event) => {

    console.log(event, event.target.value);
    const selectedCategory = event.target.value;
    console.log("Selected category:", selectedCategory);

    // Log the entire encodMathMl object and its contents for the selected category
    console.log("encodMathMl:", encodMathMl);
    console.log("encodMathMl for selected category:", encodMathMl[selectedCategory]);
    // Check length of the encoded MathML array for the selected category
    if (encodMathMl[selectedCategory]) {
      console.log("Length of encodMathMl for selected category:", encodMathMl[selectedCategory].length);
      setNumberValue(encodMathMl[selectedCategory].length)
      // Decode the last MathML item from the array
      const lastEncodedMathML = encodMathMl[selectedCategory][encodMathMl[selectedCategory].length - 1]; // Assuming the last item is the one you want to decode
      const decodedMathML = LZString.decompressFromEncodedURIComponent(lastEncodedMathML);

      console.log("Decoded MathML:", decodedMathML);
      setUpdatedMathMl(decodedMathML)
      if (mathContainerRef.current) {
        mathContainerRef.current.innerHTML = `&nbsp;${decodedMathML}&nbsp;`; // Add non-breaking spaces
        // Apply styles to mathematical elements for proper alignment
        ['mi', 'mo'].forEach((selector) => {
          mathContainerRef.current.querySelectorAll(selector).forEach((element) => {
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
          });
        });
      }
    } else {
      console.log("No MathML data for the selected category.");
      if (mathContainerRef.current) {
        mathContainerRef.current.innerHTML = ""; // Populate with formula
      }
      setNumberValue(0)
    }
    if (event.target.value === 'Add New') {
      setOpen(true);  // Open dialog when 'Add New' is selected
    } else {
      setCategoryName(event.target.value)
    }
  };

  const handleSave = () => {
    console.log('New category name:', categoryName);
    console.log("encodMathMl", encodMathMl);
    console.log("encodMathMl for selected category:", encodMathMl[categoryName]);
    console.log("encodMathMl for selected category:", encodMathMl[categoryName]?.length);
    // Check length of the encoded MathML array for the selected category
    if (encodMathMl[categoryName]) {
      console.log("Length of encodMathMl for selected category:", encodMathMl[categoryName].length);
      setNumberValue(encodMathMl[categoryName].length)
    } else {
      console.log("No MathML data for the selected category.");
      setNumberValue(0)
    }

    setOpen(false);
    setOptions([...options, categoryName])
  };

  const handleButtonClick = () => {
    console.log("Current state of encodMathMl:", encodMathMl);
    console.log("Options:", options, "Category:", categoryName);

    const finalMathML = handleConvertToMathML();
    console.log("finalMathML:", finalMathML);
    // Compress the MathML string using LZString
    const encodedMathML = LZString.compressToEncodedURIComponent(finalMathML);
    console.log("Encoded MathML:", encodedMathML);

    // Update state with spread operator
    setEncodMathMl((prevState) => {
      const updatedState = {
        ...prevState,
        [categoryName]: prevState[categoryName]
          ? [...prevState[categoryName], encodedMathML]
          : [encodedMathML],
      };

      // Store the updated state in localStorage immediately after the update
      localStorage.setItem("mathmlifyx", JSON.stringify(updatedState));

      console.log("Updated state inside setState:", updatedState);
      return updatedState; // Return the updated state
    });

    setNumberValue((prevValue) => prevValue + 1); // Increment the number field by 1

  };

  useEffect(() => {
    const savedData = localStorage.getItem("mathmlifyx");

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Get the last category by extracting keys and selecting the last one
      const lastCategory = Object.keys(parsedData).pop();
      const lastMathML = parsedData[lastCategory];

      // Get the last item in the lastMathML array
      if (lastMathML) {
        const lastEncodedMathML = lastMathML[lastMathML.length - 1]; // Access the last item

        const decodedMathML = LZString.decompressFromEncodedURIComponent(lastEncodedMathML);

        setInput(decodedMathML); // Store the actual decoded MathML in state
        // if (mathContainerRef.current) {
        //   mathContainerRef.current.innerHTML = `&nbsp;${decodedMathML}&nbsp;`; // Add non-breaking spaces
        //   // Apply styles to mathematical elements for proper alignment
        //   ['mi', 'mo'].forEach((selector) => {
        //     mathContainerRef.current.querySelectorAll(selector).forEach((element) => {
        //       element.style.display = 'inline-flex';
        //       element.style.alignItems = 'center';
        //     });
        //   });
        // }

        setLatexMathCons(decodedMathML);
        // Set options from the parsed categories and merge them with existing options, removing duplicates
        setOptions((prevOptions) => {
          const newCategories = [...prevOptions, ...Object.keys(parsedData)];
          return [...new Set(newCategories)]; // Remove duplicates using Set
        });
        // Set the last category as the selected category
        setCategoryName(lastCategory);

        // Set the number value based on the length of the last category's MathML array
        setNumberValue(lastMathML.length); // Or set it to any value based on your needs

        // Update state with the parsed data
        setEncodMathMl(parsedData);
      }

    }
  }, []); // Empty dependency array ensures it runs only once when the component mounts


  // Undo last change
  const undo = () => {
    if (undoStack.current.length === 0) return; // Nothing to undo

    redoStack.current.push(state); // Save current state for redo
    const previousState = undoStack.current.pop(); // Get last saved state

    setState(previousState); // Update state
    if (mathContainerRef.current) {
      mathContainerRef.current.innerHTML = previousState; // Restore UI
    }
  };

  // Redo last undone change
  const redo = () => {
    if (redoStack.current.length === 0) return; // Nothing to redo

    undoStack.current.push(state); // Save current state for undo
    const nextState = redoStack.current.pop(); // Get last undone state

    setState(nextState); // Update state
    if (mathContainerRef.current) {
      mathContainerRef.current.innerHTML = nextState; // Restore UI
    }
  };

  // Effect to update the value to show the plot
  useEffect(() => {
    updateMathML()
  }, [input]); // Runs when editFormData changes

  // Effect to update the value to show the plot
  useEffect(() => {
    // console.log("selectedOption", selectedOption);
    updateMathML()
  }, [selectedOption]); // Runs when editFormData changes

  const handleConvertToText = () => {
    // console.log(updatedMathMl);

    // Convert MathML to LaTeX
    let convertedLatex = MathMLToLaTeX.convert(updatedMathMl);
    // console.log("convertedLatex:", convertedLatex);

    const latex = convertedLatex.replace(/\\left\((.*?)\\right\)/g, "{$1}");
    // console.log("latex", latex);
    const textFormate = latexToPlainText(latex)
    // console.log(textFormate);
    setTextFormat(textFormate)
    setLatexMathCon(textFormate); // Save cleaned MathML to state
    setAnchorEl1(null)
  };

  const handleConvertToMathML = () => {
    console.log(updatedMathMl);
    setLatexMathCon(updatedMathMl); // Save cleaned MathML to state
    setAnchorEl1(null)
    return updatedMathMl;
  };

  const convertMathMLToLatex = () => {
    // console.log(updatedMathMl);

    // Convert MathML to LaTeX
    let convertedLatex = MathMLToLaTeX.convert(updatedMathMl);
    // console.log("convertedLatex:", convertedLatex);

    const latex = convertedLatex.replace(/\\left\((.*?)\\right\)/g, "{$1}");
    // console.log("latex", latex);

    setLatexMathCon(latex); // Save cleaned MathML to state
    setAnchorEl1(null)
  };

  const updateMathML = () => {
    const mathContainer = mathContainerRef.current;
    // console.log(mathContainer.innerHTML);

    if (!mathContainer) return;
    // console.log(mathContainer.innerHTML);

    let mathMLString = mathContainer.innerHTML;
    // console.log("mathMLString before cleaning", mathMLString);

    // Clean the MathML string
    mathMLString = cleanMathML(mathMLString);

    try {
      const parser = new DOMParser();
      const mathMLDoc = parser.parseFromString(mathMLString, 'text/xml');

      if (mathMLDoc.documentElement.nodeName === "parsererror") {
        console.error("MathML Parsing Error:", mathMLDoc.documentElement.textContent);
        return;
      }

      const serializer = new XMLSerializer();
      mathMLString = serializer.serializeToString(mathMLDoc.documentElement);

    } catch (error) {
      console.error("MathML Formatting Error:", error);
      return;
    }

    console.log("Formatted MathML:", mathMLString);
    setUpdatedMathMl(mathMLString)

    // Convert MathML to LaTeX
    let convertedLatex = MathMLToLaTeX.convert(mathMLString);
    // console.log("convertedLatex:", convertedLatex);

    const latex = convertedLatex.replace(/\\left\((.*?)\\right\)/g, "{$1}");
    console.log("latex", latex);
    const textFormate = latexToPlainText(latex)

    setTextFormat(textFormate)
  };

  const handleInput = () => {
    const mathContainer = mathContainerRef.current;
    if (mathContainer) {

      // Ensure all MathML elements have the correct number of children
      enforceMathMLStructure(mathContainer);

      undoStack.current.push(state);
      setState(mathContainer.innerHTML); // Update state with new content
      redoStack.current = []; // Clear redo stack (new change resets redo history)

      setLatexMathCons(mathContainer.innerHTML);
      setInput(mathContainer.innerHTML);
      updateMathML()
    }
  };

let patternInserted = false; // Track if a pattern was inserted

const handleKeyDown = (event) => {    
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  if (!range) return;

  const currentNode = selection.focusNode;
  const parentElement = currentNode?.nodeType === Node.TEXT_NODE ? currentNode.parentElement : currentNode;

  // Get all placeholders (□) in the math container
  const mathContainer = document.getElementById("mathContainer"); // Adjust ID if needed
  if (!mathContainer) return;
  
  const allPlaceholders = [...mathContainer.querySelectorAll("mi")].filter(mi => mi.textContent === "□");

  // ✅ **Auto-Select First Placeholder (`□`) After Pattern Insertion**
  if (patternInserted) {
      patternInserted = false; // Reset flag
      if (allPlaceholders.length > 0) {
          const firstPlaceholder = allPlaceholders[0];
          setTimeout(() => {
              const newSelection = window.getSelection();
              const newRange = document.createRange();
              newRange.setStart(firstPlaceholder, 0);
              newRange.setEnd(firstPlaceholder, 1); // Highlight first `□`
              newSelection.removeAllRanges();
              newSelection.addRange(newRange);
          }, 0);
      }
  }

  // ✅ **Ignore Arrow Keys & Control Keys**
  if (event.key.length > 1 || event.ctrlKey || event.metaKey) return; 

  // ✅ **When Typing, Replace `□` & Move to Next One**
  if (parentElement.tagName.toLowerCase() === "mi" && parentElement.textContent === "□") {
      event.preventDefault(); // Stop default behavior
      parentElement.textContent = event.key; // Replace `□` with typed character
      
      // Move cursor to the next placeholder after replacing
      const nextPlaceholder = allPlaceholders.find(mi => mi !== parentElement);
      if (nextPlaceholder) {
          setTimeout(() => {
              const newSelection = window.getSelection();
              const newRange = document.createRange();
              newRange.setStart(nextPlaceholder, 0);
              newRange.setEnd(nextPlaceholder, 1); // Highlight `□`
              newSelection.removeAllRanges();
              newSelection.addRange(newRange);
          }, 0);
      }
  }
};


  const handleClick = (event) => {
    let clickedElement = event.target;
    console.log(clickedElement);

    // If clicking outside any MathML element, don't change selection
    if (!clickedElement.closest("math")) {
      return;
    }

    // If clicking inside a MathML structure (like <msqrt>), find the nearest <mi>
    if (clickedElement.tagName.toUpperCase() !== "MI") {
      clickedElement = clickedElement.querySelector("mi");
    }

    // If we found an <mi> containing "□", find its exact position
    if (clickedElement && clickedElement.tagName.toUpperCase() === "MI" && clickedElement.textContent.includes("□")) {
      console.log("clicked");

      const selection = window.getSelection();
      const range = document.createRange();

      // Get position of "□" inside the text
      const text = clickedElement.textContent;
      const index = text.indexOf("□");

      if (index !== -1) {
        range.setStart(clickedElement.firstChild, index);
        range.setEnd(clickedElement.firstChild, index + 1); // Select only "□"

        selection.removeAllRanges();
        selection.addRange(range);

        // Prevent default behavior to avoid losing the selection
        event.preventDefault();
      }
    }
  };

  // Function to handle the operation dropdown selection
  const handleSelectOperationChange = (event) => {
    const operation = event.target.value
    setSelectedOption(event.target.value);
    console.log("textFormat", textFormat);
    console.log("operation", operation);
    try {
      let output = "";
      // Detect variables in the input
      const variables = nerdamer(textFormat).variables();
      const variable = variables.length > 0 ? variables[0] : "x"; // Default to 'x'

      // Expand operation
      if (operation === "Expand") {
        output = nerdamer(textFormat).expand().toTeX();
      }
      // Simplify operation
      else if (operation === "Simplify") {
        if (textFormat.includes("=")) {
          const [lhs, rhs] = textFormat.split("=");
          output = `${lhs.trim()} = ${nerdamer(rhs.trim()).simplify().toString()}`;
        } else {
          output = nerdamer(textFormat).simplify().toString();
        }
      }
      // Solve operation
      else if (operation === "Solve") {
        const variables = nerdamer(textFormat).variables(); // Detect variables in input
        if (variables.length === 0) {
          output = "No variables to solve for";
        } else {
          const solutions = nerdamer.solveEquations(textFormat, variables[0]); // Solve for first variable
          output = solutions.length > 0 ? solutions.toString() : "No solution found";
        }
      }
      // Evaluate operation
      else if (operation === "Evaluate") {
        const evaluationValue = 2; // Example: evaluate at x = 2
        output = nerdamer(textFormat).evaluate({ x: evaluationValue }).toString();
      }
      // Differentiate operation
      else if (operation === "Differentiate") {
        if (textFormat.includes("=")) {
          const [lhs, rhs] = textFormat.split("=").map(side => side.trim());
          output = `${lhs} = ${nerdamer(`diff(${rhs}, ${variable})`).toTeX()}`;
        } else {
          output = nerdamer(`diff(${textFormat}, ${variable})`).toTeX();
        }
      }
      // Integrate operation
      else if (operation === "Integrate") {
        if (textFormat.includes("=")) {
          const [lhs, rhs] = textFormat.split("=").map(side => side.trim());
          output = `${lhs} = ${nerdamer(`integrate(${rhs}, ${variable})`).toTeX()}`;
        } else {
          output = nerdamer(`integrate(${textFormat}, ${variable})`).toTeX();
        }
      } else {
        output = "Invalid operation";
      }

      setResult(output);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("Error processing input");
    }
  };

  useEffect(() => {
    if (selectedOption === "Plot" && textFormat) {
      console.log(textFormat);

      // Parse the input equation and plot the function
      try {
        functionPlot({
          target: plotContainerRef.current,
          width: 500,
          height: 400,
          yAxis: { label: "y" },
          xAxis: { label: "x" },
          data: [
            {
              fn: textFormat, // Set the equation from input to be plotted
              sampler: "builtIn", // Use built-in sampling for plotting
              graphType: "polyline", // Render as a polyline
            },
          ],
        });
      } catch (error) {
        console.error("Error plotting the function:", error);
      }
    }
  }, [selectedOption, textFormat]); // Re-run the effect whenever `selectedOption` or `input` changes


  return (
    <Box sx={{ boxShadow: 2, m: 2, p: 2 }}>
      <Typography variant="h5" marginRight={5} p={1}>
        MathEditor &#x2D; {mode === "add" ? "Add" : "Edit"}
      </Typography>
      <Box sx={{ flexGrow: 1, px: 16 }} >
        <Box sx={{ flexGrow: 1, backgroundColor: 'white' }} >

          {/* Top Toolbar with Menu Boxes */}
          <MenuBox>
            <Grid2 container spacing={1}>
              {/* Logo */}
              <Grid2 item>
                <Box>
                  <img
                    className="logo"
                    src={`${process.env.PUBLIC_URL}/math/img/mlq_logo.svg`}
                    alt="Logo"
                    style={{ width: '70px', height: '60px' }}
                  />
                </Box>
              </Grid2>

              <LatexEditorMenu
                mathContainerRef={mathContainerRef}
                updateMathML={updateMathML}
                undoStack={undoStack}
                state={state}
                setState={setState}
                redoStack={redoStack}
              />

              {/* <LatexInput /> */}
            </Grid2>
          </MenuBox>

          {/* Input field */}
          <Grid2 container spacing={2} sx={{ p: 1 }} >

            {/* Editable Area */}
            <Grid2 container spacing={2} sx={{ p: 1, width: "100%" }}>
              <div
                id="mathContainer"
                ref={mathContainerRef}
                contentEditable="true"
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  fontSize: '30px',
                  width: '100%'
                }}
                onInput={handleInput} // Log input changes
                onKeyDown={handleKeyDown}  // Add this line
                onClick={handleClick} // Log placeholder clicks
              >
              </div>
            </Grid2>
          </Grid2>

          {/* Bottom Actions */}
          <Grid2
            container
            spacing={1}
            sx={{ mt: 2, p: 1, }}
          >
            <Grid2 item>
              <ActionButton title="Undo" variant="contained" color="primary"
                onClick={undo}
              ><UndoIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton title="Redo" variant="contained" color="primary"
                onClick={redo}
              ><RedoIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton
                title="Copy Link"
                variant="contained"
                color="primary"
                onClick={handleCopyLink} // Trigger the copy function on button click
              >
                <ShortcutOutlinedIcon fontSize="small" />
              </ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton title="copy mathml" variant="contained" color="primary"
                onClick={() => handleConvertToMathML()}
              ><CopyAllTwoToneIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton variant="contained"
                onClick={(e) => handleMenuOpen(e, "menu3")}
              >MathML <ArrowDropDownRoundedIcon /></ActionButton>
              <Menu
                anchorEl={anchorEl1}
                open={Boolean(anchorEl1)}
                onClose={() => handleMenuClose(null)}
              >
                <MenuItem
                  onClick={() => handleConvertToText()}
                >Text</MenuItem>
                <MenuItem
                  onClick={() => convertMathMLToLatex()}
                >LaTeX</MenuItem>
                <MenuItem
                  onClick={() => handleConvertToMathML()}
                >MathML</MenuItem>
              </Menu>
            </Grid2>
            <Grid2 item>
              <ActionButton
                title="Save"
                variant="contained"
                color="primary"
                onClick={handleButtonClick} // Attach the click handler
              >
                <SaveIcon fontSize="small" />
              </ActionButton>
            </Grid2>
            <Grid2 item>
              <Select
                defaultChecked={options[0]}
                inputProps={{ "aria-label": "Without label" }}

                value={categoryName}
                onChange={handleSelectChange}
                size="small"
                sx={{
                  width: 100, // Adjust width as needed
                  height: '33px', // Set the height of the Select component
                  backgroundColor: '#365F8C',
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

                {/* Map over the options to render MenuItems */}
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Add a new math category</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Category Name"
                  type="text"
                  fullWidth
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Grid2 item>
              <TextField
                variant="outlined"
                color="primary"
                type="number"
                defaultValue={0}
                value={numberValue}  // Controlled value for the number field
                onChange={handleNumberChange}
                sx={{
                  width: 60, // Adjust width as needed
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px', // Match button border radius
                    backgroundColor: '#365F8C',
                    // borderRadius: 4, 
                    fontSize: 13,
                    color: '#fff', // Match button text color
                    height: '32px', // Explicitly set the height
                    padding: 0, // Remove extra padding
                    '& fieldset': {
                      border: 'none', // Remove border
                    },
                  },
                  '& input': {
                    height: '100%', // Fill the height of the container
                    padding: '0 8px', // Add horizontal padding
                    textAlign: 'center', // Center align the number
                    // fontWeight: 'bold',
                    color: '#fff', // Ensure text color matches the button
                  },
                }}
              />
            </Grid2>
            <Grid2 item>
              <ActionButton title="Delete" onClick={handleDeleteClick} // Attach delete function
                variant="contained" color="primary" ><DeleteIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton
                title="Save to file"
                variant="contained"
                color="primary"
                onClick={handleDownload} // Trigger the download on button click
              >
                <SaveIcon fontSize="small" />
              </ActionButton>
            </Grid2>
            <Grid2 item>
              <ActionButton
                variant="contained"
                onClick={handleFileUpload}
              >Load form file</ActionButton>
            </Grid2>
          </Grid2>

          {/* Bottom texarea2 */}
          <Grid2 container spacing={2} sx={{ p: 1 }} >  <TextField fullWidth value={latexMathCon} /> </Grid2>

          {/* Dropdown and submit */}
          <Grid2 container spacing={1} sx={{ p: 1 }} >
            <Grid2 item>
              <Select
                value={selectedOption}
                onChange={handleSelectOperationChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ minWidth: 120, maxWidth: 120 }} size="small"
              >
                <MenuItem value="Solve">
                  <em>Solve</em>
                </MenuItem>

                {/* Map over the options to render MenuItems */}
                {OPERATION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>

            <Grid2 item>
              <Button
                sx={{ backgroundColor: '#365F8C', borderRadius: 1 }}
                onClick={handleSubmit(onSubmit)} // ✅ Correct way
                variant="contained">Save</Button>
            </Grid2>
          </Grid2>

          {/* Render the plot or result*/}
          <Grid2 container sx={{ p: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Grid2 item sx={{ textAlign: "center", width: "100%" }}>

        {!mathJaxError ? (
          <MathJaxContext onError={handleMathJaxError}>
            {selectedOption === "Plot" ? (
              <div ref={plotContainerRef}></div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <MathJax>{`\\(${result}\\)`}</MathJax>
              </div>
            )}
          </MathJaxContext>
        ) : (
          <span style={{ display: "none" }}></span> // Hides errors from showing on screen
        )}
            </Grid2>
          </Grid2>

        </Box>
      </Box>
    </Box>
  );
};

export default Frame;
