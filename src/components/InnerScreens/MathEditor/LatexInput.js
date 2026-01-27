
import { MathMLToLaTeX } from 'mathml-to-latex';
import React, { useEffect, useRef, useState } from 'react';

const LatexEditor = () => {
  const mathContainerRef = useRef(null);
  const [mathMLContent, setMathMLContent] = useState(
    `<math xmlns="http://www.w3.org/1998/Math/MathML"></math>`
  );

  // Insert Fraction
  const insertFraction = () => {
    const mathML = `
      <math>
          <mfrac>
            <mi>□</mi>
            <mi>□</mi>
          </mfrac>
      </math>
    `;
    insertMathML(mathML);
  };
  

  // Insert Root
  const insertRoot = () => {
    const mathML = `
    <math>
      <msqrt>
        <mi>□</mi>
      </msqrt>
    </math> 
    `;
    insertMathML(mathML);
  };



  // Insert Subscript
  const insertSubScript = () => {
    const mathML = `
    <math>
      <msub>
        <mi>□</mi>
        <mi>□</mi>
      </msub>
    </math>
    `;
    insertMathML(mathML);
  };

  const handleClick = (event) => {
    const clickedElement = event.target;
  
    if (clickedElement.tagName === 'MI' && clickedElement.textContent.trim() === '□') {
      const range = document.createRange();
      range.selectNodeContents(clickedElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      event.preventDefault();
    }
  };
  
  // useEffect(() => {
  //   if (window.MathJax) {
  //     window.MathJax.typesetPromise();
  //   }
  // }, [mathMLContent]); // Re-render when mathMLContent changes

  const updateMathML = () => {
    const mathContainer = mathContainerRef.current;
    if (!mathContainer) return;
console.log(mathContainer);

    let content = mathContainer.innerHTML.trim();
    console.log(mathContainer.innerHTML);
    console.log(content);
    

    // Parse content to extract the MathML
    let parser = new DOMParser();
    let doc = parser.parseFromString(content, "text/html");
    let mathML = doc.querySelector("math");

    if (mathML) {
        content = mathML.innerHTML.trim(); // ✅ Extract inner content only (prevents nested <math>)
    }

    // Wrap in <math> only if needed
    const correctedMathML = `<math xmlns="http://www.w3.org/1998/Math/MathML">${content}</math>`;

    // Avoid redundant updates
    setMathMLContent((prev) => (prev === correctedMathML ? prev : correctedMathML));

    console.log("📌 Corrected MathML Output:", correctedMathML);
    // Convert MathML to LaTeX
    let latex = MathMLToLaTeX.convert(correctedMathML);
    latex = latex.replace(/\\left\((.*?)\\right\)/g, "{$1}");

    console.log(latex);
};

const insertMathML = (mathML) => {
  console.log("MathML being inserted:", mathML);

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = mathML.trim();
  let mathElement = tempDiv.firstElementChild;

  if (!mathElement || mathElement.tagName.toLowerCase() !== "math") {
    console.error("⚠️ MathML parsing failed: No valid MathML found.");
    return;
  }

  console.log("✅ Inserted MathML Element (Before Extraction):", mathElement.outerHTML);

  // ✅ Extract actual MathML node inside <math> wrapper
  if (mathElement.children.length === 1) {
    mathElement = mathElement.firstElementChild;
  }

  console.log("✅ Inserted MathML Element (After Extraction):", mathElement.outerHTML);

  // 🚀 Detect the nearest parent MathML structure
  let parentMathML = range.commonAncestorContainer;

  // Move up to the nearest MathML element (if inside a text node)
  while (parentMathML && parentMathML.nodeType === 3) {
    parentMathML = parentMathML.parentNode;
  }

  console.log("🔍 Initial Detected Parent MathML Element:", parentMathML?.outerHTML);

  // ✅ If inside <mi>, move up to its <msub> parent
  if (parentMathML?.tagName?.toLowerCase() === "mi") {
    console.log("🟡 Cursor is inside <mi>, moving up...");
    parentMathML = parentMathML.parentNode;
  }

  console.log("🔍 Updated Parent MathML Element:", parentMathML?.outerHTML);

  if (!parentMathML) {
    console.error("⚠️ No valid parent MathML element found.");
    return;
  }

  // 🚀 Handle subscript cases correctly
  if (parentMathML.tagName?.toLowerCase() === "msub") {
    let mainTerm = parentMathML.children[0]; // Main base term
    let subscript = parentMathML.children[1]; // Subscript term

    let selectionNode = range.commonAncestorContainer;
    while (selectionNode && selectionNode.nodeType === 3) {
      selectionNode = selectionNode.parentNode;
    }

    console.log("🔍 Cursor detected inside:", selectionNode?.outerHTML);

    let targetNode = selectionNode === mainTerm ? mainTerm : subscript;

    // ✅ Avoid duplicate <mrow> nesting
    if (targetNode.tagName.toLowerCase() === "mrow") {
      targetNode.appendChild(mathElement);
    } else {
      // ✅ Check if there's already an <mrow>
      let existingMrow = targetNode.querySelector("mrow");

      if (existingMrow) {
        existingMrow.appendChild(mathElement);
      } else {
        // 🚀 Wrap in <mrow> only if necessary
        let mrow = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");

        // Keep the original term if it's not a placeholder
        if (targetNode.textContent.trim() !== "□") {
          mrow.appendChild(targetNode.cloneNode(true));
        }

        mrow.appendChild(mathElement);
        parentMathML.replaceChild(mrow, targetNode);
      }
    }
  } else if (parentMathML.tagName?.toLowerCase() === "mfrac") {
    let numerator = parentMathML.children[0]; // Top part
    let denominator = parentMathML.children[1]; // Bottom part

    let selectionNode = range.commonAncestorContainer;
    while (selectionNode && selectionNode.nodeType === 3) {
      selectionNode = selectionNode.parentNode;
    }

    console.log("🔍 Cursor detected inside:", selectionNode?.outerHTML);

    let targetNode = selectionNode === numerator ? numerator : denominator;

    // ✅ Avoid duplicate <mrow> nesting
    if (targetNode.tagName.toLowerCase() === "mrow") {
      targetNode.appendChild(mathElement);
    } else {
      // ✅ Wrap inside <mrow> if needed
      let mrow = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
      if (targetNode.textContent.trim() !== "□") {
        mrow.appendChild(targetNode.cloneNode(true)); // Keep original content
      }
      mrow.appendChild(mathElement);
      parentMathML.replaceChild(mrow, targetNode);
    }
  }else {
    // 🚀 Default insertion (if not inside <msub>)
    range.deleteContents();
    range.insertNode(mathElement);
  }

  // Move cursor after inserted element
  const newRange = document.createRange();
  newRange.setStartAfter(mathElement);
  newRange.setEndAfter(mathElement);
  selection.removeAllRanges();
  selection.addRange(newRange);

  // Update the MathML state
  updateMathML();
};

  const handleInput = () => {
    updateMathML(); // Update state on input
  };

  return (
    <div>
      <h1>MathML Editor</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={insertFraction}>Insert Fraction</button>
        <button onClick={insertSubScript}>Insert Subscript</button>
        <button onClick={insertRoot}>Insert Root</button>
      </div>

      <div
        id="mathContainer"
        ref={mathContainerRef}
        contentEditable="true"
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          fontSize: '30px',
        }}
        onClick={handleClick} // Handle click events
        onInput={handleInput} // Update MathML state on input
      ></div>

      <h2>Live MathML Output:</h2>
      <pre style={{ background: '#f4f4f4', padding: '10px' }}>{mathMLContent}</pre>
    </div>
  );
};

export default LatexEditor;