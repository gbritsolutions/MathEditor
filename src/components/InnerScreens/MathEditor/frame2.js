import React, { useEffect, useRef, useState } from 'react';

const MathEditor = () => {
  const [mathContent, setMathContent] = useState(
    '<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mi>&nbsp;</mi></math>'
  );
  const mathContainerRef = useRef(null);

  const MathMLPatterns = {
    superscript: '<msup><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msup>',
    subscript: '<msub><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msub>',
    fraction: '<mfrac><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></mfrac>',
    squareRoot: '<msqrt><mi>□</mi></msqrt>',
    integral: '<mrow><mo>&int;</mo><mi>□</mi></mrow>',
    summation: '<mrow><mo>&sum;</mo><mi>□</mi></mrow>',
  };

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
  
    return {
      offset: preSelectionRange.toString().length,
      parentNode: range.startContainer,  // Save reference to parent node
    };
  };
  
  // restore the cursor
  const restoreSelection = (savedPosition) => {
    if (!savedPosition) return;
  
    const selection = window.getSelection();
    const range = document.createRange();
    let charIndex = 0;
    
    const mathContainer = document.querySelector("math");
  
    const traverseNodes = (node) => {
      if (node.nodeType === 3) {  // Text node
        const nextCharIndex = charIndex + node.length;
        if (savedPosition.offset >= charIndex && savedPosition.offset <= nextCharIndex) {
          range.setStart(node, savedPosition.offset - charIndex);
          range.setEnd(node, savedPosition.offset - charIndex);
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
  
    if (!traverseNodes(mathContainer)) {
      console.warn("❗ Cursor position not found, defaulting to end.");
      range.selectNodeContents(mathContainer);
      range.collapse(false);
    }
  
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
  const handleInputChange = () => {
    const savedCursorPos = saveSelection();  // Save cursor position
  
    let sanitizedMathML = mathContainerRef.current.innerHTML.replace(/&nbsp;/g, '');
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedMathML, "application/xml");
  
    if (doc.querySelector("parsererror")) {
      console.error("❌ MathML Parsing Error:", doc.querySelector("parsererror").innerText);
      return;
    }
  
    // Ensure all direct text nodes inside <math> are wrapped in <mi>
    doc.querySelectorAll("math").forEach(math => {
      [...math.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          const mi = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
          mi.textContent = node.textContent;
          math.replaceChild(mi, node);
        }
      });
    });
  
    // Ensure mixed content is properly separated
    doc.querySelectorAll("mi, mn, mo").forEach(el => {
      const text = el.textContent.trim();
      if (text.length === 0) {
        el.textContent = "\u00A0";  // Preserve empty space
        return;
      }
  
      const parent = el.parentNode;
      const newNodes = [...text].map(char => {
        let type = /^[0-9]$/.test(char) ? "mn" : /^[+\-*/=^!<>?.@#$%&()|{}[\]\\;:'"~]$/.test(char) ? "mo" : "mi";
        const newNode = document.createElementNS("http://www.w3.org/1998/Math/MathML", type);
        newNode.textContent = char;
        return newNode;
      });
  
      newNodes.forEach(node => parent.insertBefore(node, el));
      parent.removeChild(el);
    });
  
    const updatedMathML = new XMLSerializer().serializeToString(doc.documentElement);
    console.log("✅ updatedMathML:", updatedMathML);
  
    setMathContent(updatedMathML);
    setTimeout(() => restoreSelection(savedCursorPos), 0);  // Restore cursor after re-render
  };
  
  
  return (
    <div className="row">

        <div
          className="output mt-3 shadow-lg"
          style={{
            maxHeight: '180px',
            padding: '7px',
            marginLeft: '25px',
            marginRight: '25px',
            fontSize: '25px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
          }}
          contentEditable="true"
          ref={mathContainerRef}
          onInput={handleInputChange}
          dangerouslySetInnerHTML={{ __html: mathContent }}
        ></div>

    </div>
  );
};

export default MathEditor;
