import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Box, Button, Divider, Grid2, IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { LATEX_MENU_LABEL, mathPatterns, TEXT_MENU_LABEL } from '../../config/fieldConfig';
import TextMenuDialog from './TextMenuDialog';
import MatrixDialog from './MatrixDialog';
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";

const MobileMenuBoxItem = styled(Button)(({ theme }) => ({
  background: 'radial-gradient(at right center, rgba(5, 22, 47,  6.0), rgb(72, 122, 162))',
  borderRadius: '8px',
  width: '120px',
  height: '60px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
  color: '#fff',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'none',
  margin: '6px', // ✅ Space between options
  padding: '12px 16px', // ✅ Adds more padding inside each option
}));

const MenuBoxItem = styled(Button)(({ theme }) => ({
  background: 'radial-gradient(at right center, rgba(5, 22, 47,  6.0), rgb(72, 122, 162))',
  borderRadius: '3px',
  height: '75px', // Explicitly set height
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Adjust shadow if needed
  color: '#fff',
  fontSize: '20px', // Reduce font size if needed
}));

const LatexEditorMenu = ({
  mathContainerRef,
  handlePatternInsert,
  isDemo,
  setMathContent,
}) => {
  const [anchorEl, setAnchorEl] = useState(null); // For menu positioning
  const [currentMenu, setCurrentMenu] = useState(null); // Track the active menu
  const [isMatrixDialogOpen, setIsMatrixDialogOpen] = useState(false); // State for the dialog visibility
  const [textMenuOpen, setTextMenuOpen] = useState(false); // State for dialog
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event, index) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // ✅ Automatically close the dropdown when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) { // Adjust breakpoint if needed
        handleCloseNavMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (event, menu) => {
    if (menu === "MathSymbols3") { // When "LaTeX" is clicked
      if (isDemo) {
        handlePatternInsert(); // Default behavior
      } else {
        setAnchorEl(null); // Close any open dropdown
        setTextMenuOpen("LaTeX"); // Open LaTeX dialog
      }
    } else {
      // Default behavior for other menus
      if (currentMenu === menu) {
        if (isDemo) {
          handlePatternInsert(); // Default behavior
        } else {
          setAnchorEl(null);
          setCurrentMenu(null);
        }
      } else {
        setAnchorEl(event.currentTarget);
        setCurrentMenu(menu);
      }
    }
  };

  // Main menu close
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenu(null); // Close the menu
  };

  //dynamically handle the main menu dropdown's dialog open 
  const handleMenuItemClick = (pattern) => {
    if (isDemo) {
      handlePatternInsert(); // Default behavior
    } else if (pattern.symbol === "<mi>Text</mi>") {
      setTextMenuOpen("Text"); // Open Text dialog
    } else if (pattern.symbol === "LaTex") {
      setTextMenuOpen("LaTeX"); // Open LaTeX dialog
    } else if (pattern.symbol === 'cmatrix') {
      setIsMatrixDialogOpen(true); // Open the matrix dialog when 'cmatrix' is clicked
    } else if ((pattern.symbol === "<mi>doc</mi>" )||(pattern.symbol === "<mi>link</mi>")) {
      if (pattern.url) {
        window.open(pattern.url, "_blank"); // Open in new tab
      }
    } else {
      handlePatternInsert(pattern.mathML); // Default behavior
    }
    // Close the menu after selection
    handleCloseMenu();
  };

  // Insert the text formate from main menu
  const handleInsertText = (text) => {
    console.log("Entered Text:", text);

    // Convert LaTeX to MathML using KaTeX
    const mathML = katex.renderToString(text, {
      throwOnError: false,
      output: "mathml",
    });

    if (mathContainerRef.current) {
      let existingMathML = mathContainerRef.current.querySelector("math");

      if (existingMathML) {
        let targetNode = existingMathML.querySelector("mrow") || existingMathML;

        // Convert new MathML text into a DOM structure
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = mathML;

        let newMathContent =
          tempContainer.querySelector("mover") || // 🔥 Handle \overset
          tempContainer.querySelector("munder") || // 🔥 Handle \underset
          tempContainer.querySelector("mfrac") ||
          tempContainer.querySelector("msubsup") ||
          tempContainer.querySelector("msub") ||
          tempContainer.querySelector("msup") ||
          tempContainer.querySelector("mrow") ||
          tempContainer.querySelector("mi") ||
          tempContainer.firstElementChild;

        if (newMathContent) {
          console.log("Inserting:", newMathContent.outerHTML);

          let cursor = existingMathML.querySelector("#__cursor__");
          if (cursor) {
            cursor.insertAdjacentElement("beforebegin", newMathContent);
          } else {
            targetNode.appendChild(newMathContent);
          }
        }

        // 🔥 Ensure <mrow> is inside <mover>, <munder>, <msub>, <msup>, <msubsup>, <mfrac>
        existingMathML.querySelectorAll("mover, munder, msub, msup, msubsup, mfrac").forEach((mscript) => {
          let base = mscript.children[0];
          let subSup1 = mscript.children[1];

          if (base.tagName !== "mrow") {
            let newBase = document.createElement("mrow");
            newBase.appendChild(base.cloneNode(true));
            mscript.replaceChild(newBase, base);
          }

          if (subSup1 && subSup1.tagName !== "mrow") {
            let newSubSup1 = document.createElement("mrow");
            newSubSup1.appendChild(subSup1.cloneNode(true));
            mscript.replaceChild(newSubSup1, subSup1);
          }
        });

        const updatedMathML = existingMathML.outerHTML;
        console.log("✅ Updated MathML:", updatedMathML);

        // Update the state
        setMathContent(updatedMathML);
      }
    }
  };

  return (
    <Grid2>
      <div
      style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center' // Moved alignItems into style
        }}
      >
        {/* Mobile Display */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <img
            className="logo"
            src={`${process.env.PUBLIC_URL}/math/img/mlq_logo.svg`} // Fix template literal syntax
            alt="Logo"
            style={{ width: "60px", height: "50px" }}
          />
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{ ml: "auto" }} // ✅ Moves the icon to the right
          >
            <MenuTwoToneIcon />
          </IconButton>

          {/* Mobile Dropdown Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {Object.keys(mathPatterns).map((menuKey) => (
              <MobileMenuBoxItem
                key={menuKey}
                onClick={(e) => {
                  toggleDropdown(e, menuKey);
                  handleCloseNavMenu(); // ✅ Closes menu on selection
                }}
              >
                <Box
                  title={menuKey}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      fontSize: menuKey === "Matrices" ? "14px" : "20px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<math xmlns="http://www.w3.org/1998/Math/MathML">
                ${mathPatterns[menuKey][0].symbol}
              </math>`,
                    }}
                  ></div>

                  {/* Show dropdown icon if not "LaTex" */}
                  {mathPatterns[menuKey][0].displayName !== "LaTex" && (
                    <ArrowDropDownRoundedIcon />
                  )}
                </Box>
              </MobileMenuBoxItem>
            ))}
          </Menu>
        </Box>

        {/* Desktop Display */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: '5.7px', flexWrap: 'wrap' }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              className="logo"
              src={`${process.env.PUBLIC_URL}/math/img/mlq_logo.svg`} // Fix template literal syntax
              alt="Logo"
              style={{ width: "70px", height: "60px" }}
            />
          </Box>
          {Object.keys(mathPatterns).map((menuKey) => (
            <MenuBoxItem
              key={menuKey}
              onClick={(e) => toggleDropdown(e, menuKey)}
            >
              <Box
                title={menuKey}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    fontSize: menuKey === "Matrices" ? "14px" : "20px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `<math xmlns="http://www.w3.org/1998/Math/MathML">
              ${mathPatterns[menuKey][0].symbol}
            </math>`,
                  }}
                ></div>

                {/* Show dropdown icon if not "LaTex" */}
                {mathPatterns[menuKey][0].displayName !== "LaTex" && (
                  <ArrowDropDownRoundedIcon />
                )}
              </Box>
            </MenuBoxItem>
          ))}
        </Box>
      </div>
      {/* Menu component to display the dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && currentMenu !== null}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            justifyContent: "center",
            color: "#ffff",
            maxHeight: 250,
            minWidth: "100px",
            width: "auto",
            px: 0.8, // Reduced padding
            backgroundImage: 'linear-gradient(to right,rgb(46, 91, 155) 0%,rgb(34, 76, 136) 50%,rgb(5, 36, 77) 100%)',
            borderRadius: "3px",
            transition: "background-image 9.9s ease-in-out",
            "&:hover": {
              backgroundImage: "linear-gradient(to left,rgb(46, 91, 155) 0%,rgb(34, 76, 136) 50%,rgb(5, 36, 77) 100%)",
            },
          },
        }}
      >

        {currentMenu &&
          mathPatterns[currentMenu]?.map((pattern, index, arr) => (
            <React.Fragment key={index}>
              <MenuItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "white",
                  fontSize: "18px", // Slightly smaller font
                  padding: "4px 8px", // Reduced padding
                  minHeight: "30px", // Decreased height
                }}
                onClick={() => handleMenuItemClick(pattern)}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<math xmlns="http://www.w3.org/1998/Math/MathML"> ${pattern.mathML}</math>`,
                  }}
                ></div>
              </MenuItem>

              {/* Add Divider after each item except the last one */}
              {index < arr.length - 1 && (
                <Divider sx={{ backgroundColor: "white", my: 0.2 }} /> // Reduced spacing
              )}
            </React.Fragment>
          ))}
      </Menu>

      {/* Render the TextMenuDialog when 'Text' is clicked */}
      {textMenuOpen && (
        <TextMenuDialog
          menuName={textMenuOpen === "Text" ? TEXT_MENU_LABEL : LATEX_MENU_LABEL}
          onClose={() => setTextMenuOpen(false)}
          onInsert={handleInsertText} // Pass the function
        />
      )}

      <MatrixDialog
        open={isMatrixDialogOpen}
        onClose={() => setIsMatrixDialogOpen(false)}
        onInsert={handlePatternInsert} // Pass the insert function
      />
    </Grid2>
  );
};

export default LatexEditorMenu;

