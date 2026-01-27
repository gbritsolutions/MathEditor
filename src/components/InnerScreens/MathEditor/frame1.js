import React, { useEffect, useRef, useState } from 'react';
import { excludedElements, handleCopyLink, handleDownload, handleFileUpload, latexToPlainText, OPERATION_OPTIONS, STATE_OPTIONS, unwrapMiTags } from '../../config/fieldConfig';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Menu, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
import LatexEditorMenu from './LatexEditorMenu';
import { styled } from '@mui/system';

import SaveIcon from '@mui/icons-material/Save';
import LinkTwoToneIcon from '@mui/icons-material/LinkTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import ReplayTwoToneIcon from '@mui/icons-material/ReplayTwoTone';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';

import LZString from 'lz-string'; // Import LZString for compression
import { MathMLToLaTeX } from 'mathml-to-latex';

import nerdamer from "nerdamer";
import "nerdamer/Algebra.js"; // Import algebra support for nerdamer
import "nerdamer/Solve.js";   // Import the solver
import "nerdamer/Calculus.js"; // Import calculus functions (differentiation and integration)
import functionPlot from 'function-plot';
import { useForm } from 'react-hook-form';
import { BlockMath } from 'react-katex';
import "katex/dist/katex.min.css";  // Import KaTeX styles
import { MathJax, MathJaxContext } from 'better-react-mathjax';

import vkbeautify from 'vkbeautify';
import axios from 'axios';
import axiosClient from '../../../apis/Api';


const MenuBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
  borderRadius: '3px',
  padding: theme.spacing(1),
  // fontFamily: "Times New Roman, serif", // Ensure proper font family
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
  borderRadius: 4,
  fontSize: 12, // ✅ Keep font size the same
  padding: "10px 20px", // ✅ Increase padding for larger button
  minWidth: "80px", // ✅ Ensure button width increases
}));

const MathEditor = ({
  isRegistor,
  mode,
  editItemId,
  editFormData,
  onAddForm,
  onEditForm,
  sendDataToIframe,
  setMode,
  input,
  setInput,
  rows
}) => {
  const { handleSubmit } = useForm();
  const [mathContent, setMathContent] = useState(
    '<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mi>&nbsp;</mi></math>'
  );

  // ✅ Undo/Redo History
  const history = useRef([]);
  const historyIndex = useRef(-1);

  // ✅ Save to history inside useEffect
  useEffect(() => {
    if (history.current[historyIndex.current] !== mathContent) {
      history.current = history.current.slice(0, historyIndex.current + 1);
      history.current.push(mathContent);
      historyIndex.current++;
    }
  }, [mathContent]); // Runs whenever mathContent changes

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [encodMathMl, setEncodMathMl] = useState({})
  const [options, setOptions] = useState(['Default', 'Add New'])

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(options[0]);
  const [latexMathCon, setLatexMathCon] = useState();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption1, setSelectedOption1] = useState("Text");
  const [textFormat, setTextFormat] = useState();

  const [result, setResult] = useState("");

  const mathContainerRef = useRef(null);
  const plotContainerRef = useRef(null);
  // Create a ref for editItemId
  const editItemIdRef = useRef(editItemId);

  useEffect(() => {
    // Update the ref whenever editItemId changes
    editItemIdRef.current = editItemId;
  }, [editItemId]);

  //automaticaly focused the editable area
  useEffect(() => {
    if (mathContainerRef.current) {
      mathContainerRef.current.focus();
    }
  }, []);

  const convertTinyUrl = async (longURL) => {
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
      return response.data
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  // Define onSubmit function
  const onSubmit = async () => {
    const updatedMathMl = mathContainerRef.current.innerHTML;
    const finalMathML = formatMathML(updatedMathMl);

    if (selectedOption1 === "Text") {
      handleConvertToText();
    } else if (selectedOption1 === "Latex") {
      convertMathMLToLatex();
    } else {
      handleConvertToMathML();
    }

    const currentUrl = axiosClient.defaults.apiUrl_DemoUser

    const params = new URLSearchParams({
      finalMathML,
      categoryName,
      selectedOption1,
      selectedOption,
      result,
    });

    const longURL = `${currentUrl}?${params.toString()}`; // Append session data to URL
    let tinyUrl;

    try {
      // Shorten the URL
      tinyUrl = await convertTinyUrl(longURL);
    } catch (err) {
      console.error("Error processing URL:", err);
    }

    const finalData = {
      formula: finalMathML,
      formulaName: categoryName, // Use the received formula name
      formulaUrl: longURL,
      tinyUrl: tinyUrl,
    };

    if (isRegistor === false) {
      console.log("Non authenticate");
    } else {
      if (mode === "add") {
        onAddForm(finalData);
      } else if (mode === "edit") {
        finalData.id = editItemIdRef.current;
        onEditForm(finalData);
        setMode("add"); // Change mode to "add" after submitting in "edit" mode
      }
      if (mathContainerRef.current) {
        mathContainerRef.current.innerHTML = '<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mi>&nbsp;</mi></math>'; // Populate with formula
      }
      setLatexMathCon("")
      setResult("")
      setSelectedOption("")
    }
  };

  // Effect to update the editor content when a row is selected
  useEffect(() => {
    if (isRegistor === false) {
      console.log("Non authenticate");
    } else {
      if (mathContainerRef.current && editFormData.formula) {
        // Set the content first
        mathContainerRef.current.innerHTML = editFormData.formula; // Add non-breaking space    
        handleConvertToText();
        // show the formula name 
        setCategoryName(editFormData.formulaName)
      }
    }

  }, [editFormData]); // Runs when editFormData changes

  //Placeholder select while clicking
  useEffect(() => {
    const handlePlaceholderClick = (event) => {
      const target = event.target;

      if (target.tagName.toLowerCase() === "mi" && target.textContent === "□") {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);

        console.log("Cursor is inside the placeholder □");
      }
    };

    const handleArrowKey = (event) => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const cursorNode = range.startContainer;
      const cursorOffset = range.startOffset;

      if (cursorNode.nodeType === 3) {
        const parentElement = cursorNode.parentElement;

        if (parentElement.tagName.toLowerCase() === "mi" && parentElement.textContent === "□") {
          event.preventDefault(); // Prevent default cursor movement

          console.log("Cursor is inside the placeholder □");

          const newRange = document.createRange();
          newRange.selectNodeContents(parentElement);

          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } else if (cursorNode.tagName === "MI" && cursorNode.textContent === "□") {
        if (cursorOffset === 0) {
          console.log("Cursor is at the START of the placeholder □");
        } else if (cursorOffset === cursorNode.textContent.length) {
          console.log("Cursor is at the END of the placeholder □");
        }
      }
    };

    const mathContainer = mathContainerRef.current;

    if (mathContainer) {
      mathContainer.addEventListener("click", handlePlaceholderClick);
      document.addEventListener("keydown", handleArrowKey);
    }

    return () => {
      if (mathContainer) {
        mathContainer.removeEventListener("click", handlePlaceholderClick);
        document.removeEventListener("keydown", handleArrowKey);
      }
    };
  }, []);

  // save the cursor position
  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(mathContainerRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const charIndex = preSelectionRange.toString().length;

    return charIndex;  // ✅ Return index relative to the whole MathML tree
  };

  // restore the cursor
  const restoreSelection = (savedPosition) => {
    if (savedPosition == null) return;  // 🛑 Prevent errors

    const selection = window.getSelection();
    const range = document.createRange();
    let charIndex = 0;
    let found = false;

    const traverseNodes = (node) => {
      if (node.nodeType === 3) {  // ✅ Only count text nodes
        const nextCharIndex = charIndex + node.length;
        if (savedPosition >= charIndex && savedPosition <= nextCharIndex) {
          range.setStart(node, savedPosition - charIndex);
          range.setEnd(node, savedPosition - charIndex);
          found = true;
          return true;
        }
        charIndex = nextCharIndex;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (traverseNodes(node.childNodes[i])) return true;
        }
      }
      return false;
    };

    if (!traverseNodes(mathContainerRef.current)) {
      console.warn("❗ Cursor position not found, defaulting to end.");
      range.selectNodeContents(mathContainerRef.current);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const selectNextPlaceholder = () => {
    const placeholders = mathContainerRef.current.querySelectorAll("mi, mn, mo");
    for (let node of placeholders) {
      if (node.textContent === "□") {
        const newRange = document.createRange();
        const selection = window.getSelection();

        newRange.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(newRange);
        return true; // Stop after selecting the first placeholder found
      }
    }
    return false; // No more placeholders left
  };

  const handleInputChange = () => {
    const savedCursorPos = saveSelection(); // Save cursor position

    let rawContent = mathContainerRef.current.innerHTML.replace(/&nbsp;/g, '');

    // 🔹 Ensure <math> exists
    if (!mathContainerRef.current.querySelector("math")) {
      mathContainerRef.current.innerHTML = `<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mi>&nbsp;</mi></math>`;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawContent;
    let mathNode = tempDiv.querySelector("math");

    if (!mathNode) {
      console.error("❌ No MathML found!");
      return;
    }

    // console.log(navigator.userAgent.toLowerCase().includes("mobile"));
    // // 🔹 Handle backspace issue on mobile
    // if (navigator.userAgent.toLowerCase().includes("mobile")) {
    //   console.log(navigator);
      
    //   let miNodes = [...mathNode.querySelectorAll("mi")];
    //   if (miNodes.length > 1) {
    //     miNodes.forEach((mi, index) => {
    //       if (mi.textContent.trim() === "" && index > 0) {
    //         mi.previousElementSibling.remove(); // Remove previous <mi> on backspace
    //         mi.remove();
    //       }
    //     });
    //   }
    // }

    // 🔥 Ensure proper MathML tags for characters
    mathNode.querySelectorAll("mi, mn, mo").forEach(node => {
      const text = node.textContent.trim();
      if (text.length > 1) {
        const parent = node.parentNode;
        [...text].forEach(char => {
          let newNode;
          if (/[0-9]/.test(char)) {
            newNode = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn"); // Wrap numbers in <mn>
          } else if (/[+\-*/=^!<>?.@#$%&()|{}[\]\\;:'"~]/.test(char)) {
            newNode = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo"); // Wrap operators in <mo>
          } else {
            newNode = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi"); // Default <mi>
          }
          newNode.textContent = char;
          parent.insertBefore(newNode, node);
        });
        node.remove();
      }
    });

    // 🔥 Fix issue where numbers attach together (e.g., <mn>23</mn>)
    mathNode.querySelectorAll("mn").forEach(mn => {
      const text = mn.textContent.trim();
      if (text.length > 1) {
        const parent = mn.parentNode;
        [...text].forEach(char => {
          const newMn = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
          newMn.textContent = char;
          parent.insertBefore(newMn, mn);
        });
        mn.remove();
      }
    });

    // 🔹 Remove empty <mi> nodes only when needed
    let miNodes = mathNode.querySelectorAll("mi");
    if (miNodes.length > 1) {
      miNodes.forEach(mi => {
        if (mi.textContent.trim() === "" && !mi.closest("msqrt") && !mi.closest("mfrac")) {
          mi.remove();
        }
      });
    };
    // 🔹 Ensure there is always an <mi>&nbsp;</mi> after structures
    mathNode.querySelectorAll("mfrac, msqrt, msup, msub, msubsup, msubsubsup, mmultiscripts, munderover, mover, munder, mtable").forEach(el => {
      let nextSibling = el.nextElementSibling;
      if (!nextSibling || nextSibling.tagName !== "MI") {
        const emptyMi = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
        emptyMi.innerHTML = "&nbsp;";
        el.parentNode.insertBefore(emptyMi, el.nextSibling);
      }
    });

    // Remove empty <mi/> inside fractions and exponents
    mathNode.querySelectorAll("mfrac mrow, msup mrow, msub mrow, msqrt mrow, msubsup mrow, msubsubsup mrow, mmultiscripts mrow, munderover mrow, mover mrow, munder mrow, mtable mrow").forEach(mrow => {
      mrow.querySelectorAll("mi").forEach(mi => {
        if (mi.textContent.trim() === "") mi.remove();
      });
    });

    const updatedMathML = new XMLSerializer().serializeToString(mathNode);
    let updatedMathMl = mathContainerRef.current.innerHTML;

    // 🔹 Restore math structure if deleted
    if (!updatedMathML.includes("<math")) {
      setMathContent(`<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mi>&nbsp;</mi></math>`);
    } else {
      setMathContent(updatedMathML);
    }

    try {
      // ✅ Remove `&nbsp;` before conversion
      const updatedMathMl_1 = updatedMathMl.replace(/&nbsp;/g, '');
      let convertedLatex = MathMLToLaTeX.convert(updatedMathMl_1);

      // ✅ Remove unnecessary `\left` and `\right`
      convertedLatex = convertedLatex.replace(/\\left\./g, '').replace(/\\right\./g, '');

      // ✅ Fix exponentiation: Convert `\hat<number>` to `^<number>`
      convertedLatex = convertedLatex.replace(/\\hat\s?(\d+)/g, '^$1');

      // ✅ Fix misformatted parentheses
      convertedLatex = convertedLatex.replace(/\\left/g, '').replace(/\\right/g, '');

      // ✅ Remove `\ ` (non-breaking spaces in LaTeX)
      convertedLatex = convertedLatex.replace(/\\ /g, '');
      const textFormate = latexToPlainText(convertedLatex);

      setTextFormat(textFormate);
    } catch (error) {
      console.log("error", error);
    }

    // 🔥 Restore cursor position
    setTimeout(() => {
      if (!selectNextPlaceholder()) {
        restoreSelection(savedCursorPos);
      }
    }, 0);
  };

  const handlePatternInsert = (patternMathML) => {
    if (!patternMathML) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let mathTag = mathContainerRef.current.querySelector("math");

    if (!mathTag) {
      console.error("No <math> tag found!");
      return;
    }

    // Ensure insertion happens inside <math>
    if (!mathTag.contains(range.startContainer)) {
      console.warn("Cursor is outside <math>, moving inside...");
      range.selectNodeContents(mathTag);
      range.collapse(false); // Move to end of <math>
    }

    // Convert patternMathML to DOM elements
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = patternMathML;
    const fragment = document.createDocumentFragment();

    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    range.deleteContents();
    range.insertNode(fragment);

    // Ensure <math> structure is correct after insertion
    mathContainerRef.current.innerHTML = unwrapMiTags(mathContainerRef.current.innerHTML);

    setMathContent(mathContainerRef.current.innerHTML);

    setTimeout(() => {
      const newRange = document.createRange();
      const selection = window.getSelection();
      const mathTag = mathContainerRef.current.querySelector("math");

      if (mathTag) {
        newRange.selectNodeContents(mathTag);
        newRange.collapse(false); // Move to end of <math>
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }, 0);

    // Move cursor to next placeholder
    setTimeout(selectNextPlaceholder, 0);
  };

  const undo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      setMathContent(history.current[historyIndex.current]);
    }
  };

  const redo = () => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      setMathContent(history.current[historyIndex.current]);
    }
  };

  const handleClose = (menuId) => {
    setAnchorEl(null);
    setAnchorEl1(null)
    setOpen(false);
  };

  const handleSelectChange = (event) => {

    const selectedCategory = event.target.value;

    console.log("encodMathMl for selected category:", encodMathMl[selectedCategory]);

    if (event.target.value === 'Add New') {
      setOpen(true);  // Open dialog when 'Add New' is selected
    } else {
      setCategoryName(event.target.value)
    }
  };

  // set the formula names in dropdown from db
  useEffect(() => {
    const uniqueFormulaNames = [...new Set(rows?.map(item => item.formulaName))];
    // ✅ Combine old and new options without duplicates
    const updatedOptions = [...new Set([...options, ...uniqueFormulaNames])];
    setOptions(updatedOptions);
  }, [rows]);


  const handleSave = () => {
    setOpen(false);
    setOptions([...options, categoryName])
  };

  // get the value from localstorage
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
        if (mathContainerRef.current) {
          mathContainerRef.current.innerHTML = decodedMathML; // Populate with formula
        }
        // Set options from the parsed categories and merge them with existing options, removing duplicates
        setOptions((prevOptions) => {
          const newCategories = [...prevOptions, ...Object.keys(parsedData)];
          return [...new Set(newCategories)]; // Remove duplicates using Set
        });
        // Set the last category as the selected category
        setCategoryName(lastCategory);

        // Update state with the parsed data
        setEncodMathMl(parsedData);
      }

    }
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const formatMathML = (mathMLString) => {
    // Remove &nbsp; which is invalid in XML
    const cleanedMathML = mathMLString.replace(/&nbsp;/g, "");

    const parser = new DOMParser();
    const xml = parser.parseFromString(cleanedMathML, "application/xml");

    // Check if there are parsing errors
    const errorNode = xml.querySelector("parsererror");
    if (errorNode) {
      console.error("MathML Parsing Error:", errorNode.textContent);
      return cleanedMathML; // Return original MathML if parsing fails
    }

    const serializer = new XMLSerializer();
    const formattedMathML = serializer.serializeToString(xml);
    return vkbeautify.xml(formattedMathML); // Prettify XML
  };

  const handleConvertToMathML = () => {
    const updatedMathMl = mathContainerRef.current.innerHTML;
    const formattedMathML = formatMathML(updatedMathMl);
    setLatexMathCon(formattedMathML); // Save formatted MathML
    setAnchorEl1(null);
    setSelectedOption1("MathMl");
    return formattedMathML;
  };

  const handleCopyMathml = () => {
    const updatedMathMl = mathContainerRef.current?.innerHTML;
    if (!updatedMathMl) {
      alert("No MathML content found to copy!");
      return;
    }

    const formattedMathML = formatMathML(updatedMathMl);
    let textToCopy = "";

    if (selectedOption1 === "Text") {
      textToCopy = handleConvertToText();
    } else if (selectedOption1 === "MathMl") {
      textToCopy = formattedMathML;
      setLatexMathCon(formattedMathML);
      setAnchorEl1(null);
    } else if (selectedOption1 === "Latex") {
      textToCopy = convertMathMLToLatex();
    }

    if (!textToCopy) {
      alert("Nothing to copy!");
      return;
    }

    // Fallback method for HTTP: Use a temporary text area
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");  // ✅ Works in HTTP
    document.body.removeChild(tempTextArea);

  };

  const handleConvertToText = () => {
    try {
      let updatedMathMl = mathContainerRef.current.innerHTML;

      // ✅ Remove `&nbsp;` before conversion
      updatedMathMl = updatedMathMl.replace(/&nbsp;/g, '');

      let convertedLatex = MathMLToLaTeX.convert(updatedMathMl);

      // ✅ Remove unnecessary `\left` and `\right`
      convertedLatex = convertedLatex.replace(/\\left\./g, '').replace(/\\right\./g, '');

      // ✅ Fix exponentiation: Convert `\hat<number>` to `^<number>`
      convertedLatex = convertedLatex.replace(/\\hat\s?(\d+)/g, '^$1');

      // ✅ Fix misformatted parentheses
      convertedLatex = convertedLatex.replace(/\\left/g, '').replace(/\\right/g, '');

      // ✅ Remove `\ ` (non-breaking spaces in LaTeX)
      convertedLatex = convertedLatex.replace(/\\ /g, '');
      const textFormate = latexToPlainText(convertedLatex);
      setTextFormat(textFormate);
      setLatexMathCon(textFormate); // Save cleaned MathML to state
      setAnchorEl1(null);
      setSelectedOption1("Text");
      return textFormate; // ✅ Now returning the converted text
    } catch (error) {
      console.error('MathML to LaTeX conversion error:', error);
      setAnchorEl1(null);
      return ""; // Return empty string on error
    }
  };

  const convertMathMLToLatex = () => {
    try {
      let updatedMathMl = mathContainerRef.current.innerHTML
      updatedMathMl = updatedMathMl.replace(/&nbsp;/g, '');
      let convertedLatex = MathMLToLaTeX.convert(updatedMathMl);

      // Remove unnecessary \left and \right
      convertedLatex = convertedLatex.replace(/\\left\./g, '').replace(/\\right\./g, '');

      // Replace \hat<number> with ^<number> for exponentiation
      convertedLatex = convertedLatex.replace(/\\hat\s?(\d+)/g, '^$1');

      // Fix misformatted parentheses (if still an issue)
      convertedLatex = convertedLatex.replace(/\\left/g, '').replace(/\\right/g, '');

      setLatexMathCon(convertedLatex); // Save cleaned MathML to state
      setAnchorEl1(null)
      setSelectedOption1("Latex")
      return convertedLatex; // ✅ Now returning the converted latex
    } catch (error) {
      console.error('MathML to LaTeX conversion error:', error);
      setAnchorEl1(null)
      return ""; // Return empty string on error
    }
  };

  const handleSelectStateChange = (event) => {
    const operation = event.target.value;
    console.log("Selected:", operation);

    setSelectedOption1(operation);  // ✅ Update state

    try {
      if (operation === "Text") {
        handleConvertToText();
      } else if (operation === "Latex") {
        convertMathMLToLatex();
      } else if (operation === "MathMl") {
        handleConvertToMathML();
      }
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleSelectOperationChange = (event) => {
    const operation = event.target.value;
    setSelectedOption(operation);
    try {
      let output = "";
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
        if (!textFormat.includes("=")) {
          output = "Equation must contain '=' to solve.";
        } else {
          const [lhs, rhs] = textFormat.split("=").map(side => side.trim());
          const equation = `${lhs} - (${rhs})`; // Convert to standard form

          try {
            const solutions = nerdamer.solveEquations(equation, variable) || [];
            console.log("Raw Solutions:", solutions);

            // Filter out complex solutions
            const realSolutions = solutions.filter(sol => !sol.toString().includes("i"));
            output = realSolutions.length > 0 ? realSolutions.toString() : "No real solutions found";
          } catch (err) {
            console.error("Solve error:", err);
            output = "Error solving equation";
          }
        }
      }
      // Evaluate operation
      else if (operation === "Evaluate") {
        const evaluationValue = prompt("Enter value for x:", "2");
        if (!isNaN(evaluationValue)) {
          output = nerdamer(textFormat).evaluate({ x: Number(evaluationValue) }).toString();
        } else {
          output = "Invalid evaluation value";
        }
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
      }
      // Invalid operation
      else {
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

      try {
        let expression = textFormat.replace(/\s+/g, "");

        console.log("Processed Expression:", expression);

        // Check if input is in the form `x = ...`
        if (expression.startsWith("x=")) {
          let xValue = expression.replace("x=", "");

          if (isNaN(xValue)) {
            console.error("Invalid x value:", xValue);
            return;
          }

          console.log("Plotting vertical line at x =", xValue);

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

        console.log("Formatted Function for Plot:", formattedFunction);

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
  }, [selectedOption, textFormat, editItemId]);


  return (
    <Box sx={{ boxShadow: 2, m: { xs: 1, md: 2 }, p: { xs: 1, md: 2 } }}>
      <Typography variant="h5" marginRight={5} p={1}>
        MathEditor &#x2D; {mode === "add" ? "Add" : "Edit"}
      </Typography>
      {/* <Box sx={{ flexGrow: 1, px: 16 }} > */}
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4, md: 16 } }}>
        <Box sx={{ flexGrow: 1, backgroundColor: 'white' }} >

          {/* Top Toolbar with Menu Boxes */}
          <MenuBox>
            <Grid2 container={true} spacing={1}>
              <Grid2 item={true} xs={12}>
                <LatexEditorMenu
                  mathContainerRef={mathContainerRef}
                  handlePatternInsert={handlePatternInsert}
                  setMathContent={setMathContent}
                />
              </Grid2>
            </Grid2>
          </MenuBox>

          {/* Input field */}
          <Grid2 container={true} spacing={2} sx={{ p: 1 }} className="col-12">
            {/* Editable Area */}
            <Grid2 container={true} spacing={2} sx={{ py: 1, width: "100%" }}>
              <div
                className="output mt-3 shadow-lg"
                style={{
                  maxHeight: "180px",
                  overflowY: "auto",   // Enable vertical scrolling
                  padding: "7px",
                  margin: "0 auto",  // Center the div
                  fontSize: "26.66667px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  width: "100%",      // Make it take full width
                  // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                  boxSizing: "border-box", // Ensure padding does not affect width
                }}
                contentEditable="true"
                ref={mathContainerRef}
                onInput={handleInputChange}
                dangerouslySetInnerHTML={{ __html: mathContent }}
              ></div>
            </Grid2>
          </Grid2>


          {/* Bottom Actions */}
          <Grid2
            container={true}
            spacing={1}
            sx={{ mb: 2, p: 1 }}
          >
            <Grid2 item={true}>
              <ActionButton title="Undo" variant="contained" color="primary"
                onClick={undo}
              ><ReplayTwoToneIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item={true}>
              <ActionButton title="Redo" variant="contained" color="primary"
                onClick={redo}
              ><RefreshTwoToneIcon fontSize="small" /></ActionButton>
            </Grid2>
            {/* <Grid2 item>
              <ActionButton
                title="Copy Link"
                variant="contained"
                color="primary"
                onClick={handleCopyLink} // Trigger the copy function on button click
              >
                <LinkTwoToneIcon fontSize="small" />
              </ActionButton>
            </Grid2> */}
            <Grid2 item={true}>
              <ActionButton title="copy mathml" variant="contained" color="primary"
                onClick={() => handleCopyMathml()}
              ><CopyAllOutlinedIcon fontSize="small" /></ActionButton>
            </Grid2>
            <Grid2 item={true}>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={selectedOption1}
                onChange={handleSelectStateChange}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  // backgroundColor: ' #224488 !important',
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',

                  // border: '.5px solid #33C3F0', // Add width and style
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
                {STATE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}

              </Select>
            </Grid2>
            <Grid2 item={true}>
              <Select
                defaultChecked={options[0]}
                inputProps={{ "aria-label": "Without label" }}

                value={categoryName}
                onChange={handleSelectChange}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  // backgroundColor: '#365F8C',d
                  // backgroundColor: ' #224488 !important',
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',

                  // borderRadius: 4, 
                  // fontSize: 11,
                  // border:' #33C3F0',
                  // border: '.5px solid #33C3F0', // Add width and style
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
            <Grid2 item={true}>
              {isRegistor === false ? <></> :
                <ActionButton
                  title="Save to file"
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleDownload(rows)} // Trigger the download on button click
                >
                  <SaveIcon fontSize="small" />
                </ActionButton>}

            </Grid2>
            <Grid2 item={true}>
              <ActionButton
                variant="contained"
                onClick={(e) => handleFileUpload(mathContainerRef)}
              >Load form file</ActionButton>
            </Grid2>

            <Grid2 item={true}>
              <Select
                defaultChecked={OPERATION_OPTIONS[0]}
                inputProps={{ "aria-label": "Without label" }}
                value={selectedOption}
                onChange={handleSelectOperationChange}
                sx={{
                  width: 100, // Adjust width as needed
                  height: '40px', // Set the height of the Select component
                  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',

                  // backgroundColor: ' #224488 !important',
                  // border: '.5px solid #33C3F0', // Add width and style
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

                {/* Map over the options to render MenuItems */}
                {OPERATION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 item={true}>
              {isRegistor === false ? <></> :
                <ActionButton
                  variant="contained"
                  onClick={handleSubmit(onSubmit)} // ✅ Correct way
                >Submit</ActionButton>}
            </Grid2>
          </Grid2>

          {/* Bottom texarea2 */}
          <Grid2 container={true} spacing={2} sx={{ p: 1 }}>
            {/* Raw MathML in a TextField for copying */}
            <TextField
              fullWidth
              value={latexMathCon}
              onChange={(e) => {
                setLatexMathCon(e.target.value)
                setTextFormat(e.target.value)
              }} // Update state on change
              multiline
              maxRows={3}
              variant="outlined" // Ensures the border is visible
            />
          </Grid2>

          {/* Render the plot or result*/}
          <Grid2
            container={true}
            sx={{ p: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Grid2 item={true} sx={{ textAlign: "center", width: "100%" }}>
              {selectedOption === "Plot" ? (
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
        </Box>
      </Box>
    </Box>
  );
};

export default MathEditor;