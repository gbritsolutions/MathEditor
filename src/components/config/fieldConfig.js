import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { SERVENET_ERROR } from "./toastMessage";
import { Box, Button, styled } from "@mui/material";

// Function to get error message for each case for Password Validation
export const getPasswordErrorMessage = (value) => {
  if (/\s/.test(value)) {
    return "Whitespace is not allowed";
  }
  if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])/.test(
      value
    )
  ) {
    return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  // Return null if no validation error
  return null;
};

// Business Email Validations

const invalidMails = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "zoho.com",
  "mail.com",
  "protonmail.com",
  "hotmail.com",
];

export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const forbiddenDomains = invalidMails;
  if (!emailRegex.test(value)) {
    return "Invalid email address format";
  }
  const domain = value.split("@")[1];
  if (forbiddenDomains.includes(domain)) {
    return "Company email address only allowed ";
  }
  return true;
};

// Encode Password
const IV = "1234567898765432";
const SECRET_KEY = "00112233445566778899AABBCCDDEEFF";

export const encryptPwd = (plainText) => {
  try {
    // Truncate or pad the IV to 16 bytes (128 bits)
    const ivBytes = CryptoJS.enc.Utf8.parse(IV.substring(0, 16));
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch (error) {
    return null;
  }
};

export const decryptAes = (encryptedText) => {
  try {
    // Truncate or pad the IV to 16 bytes (128 bits)
    const ivBytes = CryptoJS.enc.Utf8.parse(IV.substring(0, 16));

    // Decrypt the text using AES
    const decrypted = CryptoJS.AES.decrypt(
      encryptedText,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    // Convert the decrypted data to a UTF-8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const foundedUser = async (foundUser) => {
  if (foundUser) {
    let Id;
    let organizationName;
    if (foundUser) {
      // User exists, you can access the organizationName
      organizationName = foundUser.organization.organizationName;
      Id = foundUser.id;
      sessionStorage.setItem("id", Id);
      sessionStorage.setItem("organizationName", organizationName);
      return organizationName;
    } else {
      return "User not found";
    }
  }
};

// to allow 50 words only
export const validate50Words = (value) => {
  const wordCount = value.trim().split(/\s+/).length;
  return wordCount <= 50 || "Maximum 50 words allowed";
};

// Validation function to check for empty or whitespace-only strings
export const validateNotEmptySpace = (value) => {
  if (typeof value !== "string") {
    return true; // Skip validation if the value is not a string
  }
  return value.trim().length !== 0 || "Empty space not allowed";
};

// Call the addSerialNumber function to modify rows
export const addSerialNumber = (rows) => {
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row, index) => {
    return { ...row, siNo: index + 1 };
  });
};

export const addSiNoPaginationCount = (rows, page, records) => {
  if (page && records) {
    // Calculate the initial serial number based on the page and records
    const initialSerialNumber = page * records + 1;
    // Map over the rows and add serial number
    return rows.map((row, index) => {
      // Calculate the serial number for the current row
      const serialNumber = initialSerialNumber + index;
      return { ...row, siNo: serialNumber };
    });
  } else {
    return rows.map((row, index) => {
      return { ...row, siNo: index + 1 };
    });
  }
};

// Format Duplicate check for the fields

// Function to format the label by capitalizing the first letter and separating camel case words with spaces
function formatLabel(label) {
  return (
    label.charAt(0).toUpperCase() +
    label.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")
  );
}

// Function to check if two labels are duplicates considering variations in spacing and capitalization
export function areLabelsDuplicates(label1, label2) {
  // Format both labels
  const formattedLabel1 = formatLabel(label1);
  const formattedLabel2 = formatLabel(label2);

  // Check if the formatted labels are the same
  return formattedLabel1 === formattedLabel2;
}

// Function to handle API calls with feedback messages
export const handleApiCall = async (
  promise,
  action,
  fetchData,
  navigateError403
) => {
  try {
    // Await the promise resolution
    const res = await promise;

    // Log the response for debugging purposes
    console.log(`Response for ${action}:`, res, SERVENET_ERROR);

    // Display a feedback message using SweetAlert2 library
    Swal.fire({
      // Display response data or error message
      text: res?.data || res?.response?.data || SERVENET_ERROR,
      // Set icon based on response status
      icon: res?.status === 200 ? "success" : "error",
      width: "auto",
      didOpen: () => {
        document.querySelector(".swal2-popup").style.maxWidth = "300px";
      },
    });

    // If the request is successful, fetch data
    if (res?.status === 200) fetchData();
  } catch (error) {
    // If an error occurs, log the error and navigate to an error page
    // console.error(`Error ${action.toLowerCase()} item:`, error);
    navigateError403();
  }
};

// Default custom field for beneficiary screen
export const DefaultCustomField = [
  "Adjustment To Payout",
  "Target Compensation",
  "Recovery From Payout",
  "Salary Account",
  "Payout Currency",
];

// dropdowns for selected screen
export const PAGE_OPTIONS = [
  "Product",
  "Beneficiary",
  "Customer",
  "Transaction",
];

// Adjustment Options For Assign Commission
export const adjustmentOptions = [
  "Cap Adjust",
  "Draw/Adv Adjust",
  "Min Pay Adjust",
  "Other Adjust",
  "Adjust To Payout",
  "Recov From Payout",
];

//Current Screen
export const BENEFICIARY_SCREEN = "Beneficiary";
export const CUSTOMER_SCREEN = "Customer";
export const PRODUCT_SCREEN = "Product";
export const TRANSACTION_SCREEN = "Transaction";
export const VARIABLE_SCREEN = "Variable";

// Website Url
export const WEB_URL = "http://147.93.18.223/";
export const CONTACT_MAIL = "contact@compfact.co";

// To remove the fields from commission screen
export const excludePatterns =
  /^calcDescription_|^calcEntityName_|^calcOption_|^calcSymbols_|^calcSelection_|^selection_|^conDescription_|^symbols_|^conditionEntityName_/;

// dropdowns for the operation
export const OPERATION_OPTIONS = [
  // "Solve",
  "Simplify",
  "Expand",
  "Evaluate",
  "Differentiate",
  "Integrate",
  "Plot",
];

// dropdowns for the state
export const STATE_OPTIONS = [
  { name: "Text", value: "Text" },
  { name: "LaTeX", value: "Latex" },
  { name: "MathML", value: "MathMl" },
];

// // Sample list of math symbols
// export const SYMBOLS = [
//   "∑", "∫", "∂", "Π", "∪", "∩", "±", "∞",
//   "∀", "∈", "≈", "←", "∧", "∨", "∉", "∅",
//   "∋", "⇒", "⇔", "⊥", "⊕", "⊗", "⋅", "∇"
// ];

// List of 36 symbols with their names
export const SYMBOLS = [
  { name: "Sigma", value: "∑" },
  { name: "Integral", value: "∫" },
  { name: "Partial Derivative", value: "∂" },
  { name: "Pi", value: "Π" },
  { name: "Infinity", value: "∞" },
  { name: "Plus Minus", value: "±" },
  { name: "Approximately Equal", value: "≈" },
  { name: "Logical AND", value: "∧" },
  { name: "Logical OR", value: "∨" },
  { name: "Nabla", value: "∇" },
  { name: "Circled Plus", value: "⊕" },
  { name: "Circled Times", value: "⊗" },
  { name: "Perpendicular", value: "⊥" },
  { name: "Not Element Of", value: "∉" },
  { name: "Subset Of", value: "⊆" },
  { name: "Superset Of", value: "⊇" },
  { name: "Empty Set", value: "∅" },
  { name: "Element Of", value: "∈" },
  { name: "Implies", value: "⇒" },
  { name: "If and Only If", value: "⇔" },
  { name: "Symmetric Difference", value: "⊖" },
  { name: "Union", value: "∪" },
  { name: "Intersection", value: "∩" },
  { name: "Not Equal", value: "≠" },
  { name: "Right Arrow", value: "→" },
  { name: "Left Arrow", value: "←" },
  { name: "Up Arrow", value: "↑" },
  { name: "Down Arrow", value: "↓" },
  { name: "Square Root", value: "√" },
  { name: "Cube Root", value: "∛" },
  { name: "Angle", value: "∠" },
  { name: "Perpendicular Angle", value: "⊥" },
  { name: "Dot Operator", value: "⋅" },
  { name: "Proportional To", value: "∝" },
  { name: "Subset", value: "⊂" },
  { name: "Superset", value: "⊃" },
];

export const SYMBOLS2 = [
  { name: "Alpha", value: "α" },
  { name: "Beta", value: "β" },
  { name: "Gamma", value: "γ" },
  { name: "Delta", value: "δ" },
  { name: "Epsilon", value: "ε" },
  { name: "Zeta", value: "ζ" },
  { name: "Eta", value: "η" },
  { name: "Theta", value: "θ" },
  { name: "Iota", value: "ι" },
  { name: "Kappa", value: "κ" },
  { name: "Lambda", value: "λ" },
  { name: "Mu", value: "μ" },
  { name: "Nu", value: "ν" },
  { name: "Xi", value: "ξ" },
  { name: "Omicron", value: "ο" },
  { name: "Pi", value: "π" },
  { name: "Rho", value: "ρ" },
  { name: "Sigma", value: "σ" },
  { name: "Tau", value: "τ" },
  { name: "Upsilon", value: "υ" },
  { name: "Phi", value: "φ" },
  { name: "Chi", value: "χ" },
  { name: "Psi", value: "ψ" },
  { name: "Omega", value: "ω" }
];

export const SYMBOLS3 = [
  { name: "Nabla", value: "∇" },
];

export const TEXT_MENU_LABEL = 'Text'
export const LATEX_MENU_LABEL = 'LaTex'

// Convert LaTeX to MathML using MathJax (via react-mathjax2)
export const convertLatexToMathML = (latex) => {
  return `<math xmlns="http://www.w3.org/1998/Math/MathML">${latex}</math>`; // Wrap it for MathML conversion
};


export const handleDownload = (rows) => {
  // Convert each object dynamically into a readable text format
  const content = rows
    .map(row => 
      Object.entries(row) // Extract all key-value pairs
        .map(([key, value]) => `${key}: ${value}`) // Convert each key-value pair to string
        .join("\n") // Join each field with a newline
    )
    .join("\n------------------------------------------------\n"); // Separator between objects

  // Create a Blob object
  const blob = new Blob([content], { type: "text/plain" });

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mlq.txt"; // File name

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const handleFileUpload = (mathContainerRef) => {
  // Create a hidden file input element
  const input = document.createElement('input');
  input.type = 'file'; // Set the input type to file

  // Add a change event listener to the input element
  input.onchange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result; // Get file content
        mathContainerRef.current.innerHTML = fileContent
      };

      // Read the file as text
      reader.readAsText(file);
    }
  };

  // Trigger the file input click
  input.click();
};

// export const handleCopyLink = () => {
//   // Get the current browser URL
//   const currentUrl = window.location.href;
//   console.log(currentUrl);

//   // Copy the URL to the clipboard
//   navigator.clipboard.writeText(currentUrl)
//     .then(() => {
//       alert('Link copied to clipboard');
//     })
//     .catch((error) => {
//       console.error('Failed to copy link: ', error);
//       alert('Failed to copy link');
//     });
// };

export const handleCopyLink = () => {
  const currentUrl = window.location.href;
  const token = sessionStorage.getItem("token");
  const response = sessionStorage.getItem("response");
  const organizationName = sessionStorage.getItem("organizationName");
  const userName = sessionStorage.getItem("userName");
  const beneficiaryId = sessionStorage.getItem("beneficiaryId");
  const orgId = sessionStorage.getItem("orgId");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  const res = sessionStorage.getItem("res");

  const params = new URLSearchParams({
    token,
    response,
    organizationName,
    userName,
    beneficiaryId,
    orgId,
    isAuthenticated,
    res,
  });

  const newUrl = `${currentUrl}?${params.toString()}`; // Append session data to URL

  // ✅ Create a temporary input element
  const tempInput = document.createElement("input");
  tempInput.value = newUrl;
  document.body.appendChild(tempInput);

  // ✅ Select and copy the text
  tempInput.select();
  document.execCommand("copy"); // Copies to clipboard
  document.body.removeChild(tempInput); // Cleanup

  alert("Link copied successfully!"); // ✅ Show confirmation
};

export const mathPatterns = {
  'subscript superscript': [
    { symbol: '<msub><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msub>', mathML: '<msub><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msub>', latex: '{\\Box}_{\\Box}' },
    { symbol: '<msup><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msup>', mathML: '<msup><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msup>', latex: '{\\Box}^{\\Box}' },
    { symbol: '<msubsup><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msubsup>', mathML: '<msubsup><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></msubsup>', latex: '{\\Box}^{\\Box}_{\\Box}' },
    {
      symbol: '<math><mmultiscripts><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mprescripts/><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></mmultiscripts></math>',
      mathML: '<math><mmultiscripts><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow><mprescripts/><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></mmultiscripts></math>',
      latex: '_{\\Box}^{\\Box}\\Box_{\\Box}^{\\Box}'
    }],
  'square root': [
    { symbol: '<msqrt><mrow><mi>□</mi></mrow></msqrt>', mathML: '<msqrt><mrow><mi>□</mi></mrow></msqrt>', latex: '\\sqrt{\\Box}' },
    {
      symbol: '<msup><mi></mi><mrow><mi>□</mi></mrow></msup><msqrt><mrow><mi>□</mi></mrow></msqrt>',
      mathML: '<msup><mi></mi><mrow><mi>□</mi></mrow></msup><msqrt><mrow><mi>□</mi></mrow></msqrt>',
      latex: '^{\\Box}{\\sqrt{\\Box}}'
    }
  ],
  'fraction': [
    { symbol: '<mfrac><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></mfrac>', mathML: '<mfrac><mrow><mi>□</mi></mrow><mrow><mi>□</mi></mrow></mfrac>', latex: '\\frac{\\Box}{\\Box}' },
    { symbol: '<mi>D□/D□</mi>', mathML: '<mfrac><mrow><mi>d</mi><mi>□</mi></mrow><mrow><mi>d</mi><mi>□</mi></mrow></mfrac>', latex: '\\frac{D\\Box}{D\\Box}' },
    { symbol: '<mi>∂□/∂□</mi>', mathML: '<mfrac><mrow><mi>∂</mi><mi>□</mi></mrow><mrow><mi>∂</mi><mi>□</mi></mrow></mfrac>', latex: '\\frac{∂\\Box}{∂\\Box}' },
  ],
  'underAndOver': [
    {
      symbol: '<math><munderover><mrow><mi>∑</mi></mrow><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow></munderover></math>',
      mathML: '<munderover><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow></munderover>',
      latex: '\\underset{\\Box}{\\overset{\\Box}{\\sum}}'
    },
    {
      symbol: 'Under',
      mathML: '<munder><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow></munder>',
      latex: '\\underset{\\Box}{\\Box}'
    },
    {
      symbol: 'Over',
      mathML: '<mover><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow></mover>',
      latex: '\\overset{\\Box}{\\Box}'
    },
  ],
  'xunderAndOver': [
    {
      symbol: '<math><mover><mrow><mi>&square;</mi></mrow><mo>&RightArrow;</mo></mover></math>',
      mathML: '<mover><mrow><mi>&square;</mi></mrow><mo>&RightArrow;</mo></mover>',
      latex: '\\overrightarrow{\\Box}'
    },
    {
      symbol: 'overbrace',
      mathML: '<mover><mrow><mi>&square;</mi></mrow><mo>&OverBrace;</mo></mover>',
      latex: '\\overbrace{\\Box}'
    },
    {
      symbol: 'underbrace',
      mathML: '<munder><mrow><mi>&square;</mi></mrow><mo>&UnderBrace;</mo></munder>',
      latex: '\\underbrace{\\Box}'
    },
    {
      symbol: 'overline',
      mathML: '<mover><mrow><mi>&square;</mi></mrow><mo>&OverBar;</mo></mover>',
      latex: '\\overline{\\Box}'
    },
    {
      symbol: 'underline',
      mathML: '<munder><mrow><mi>&square;</mi></mrow><mo>&UnderBar;</mo></munder>',
      latex: '\\underline{\\Box}'
    },
    {
      symbol: 'widehatover',
      mathML: '<mover><mrow><mi>&square;</mi></mrow><mo stretchy="true">^</mo></mover>',
      latex: '\\overset{\\hat{}}{\\Box}'
    },
  ],

  'Matrices': [
    {
      symbol: '<mtable><mtr><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr><mtr><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr> <mtr> <mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr> </mtable>',
      mathML: '<mtable><mtr><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr><mtr><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr> <mtr> <mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd><mtd><mi >□</mi></mtd></mtr> </mtable>',
      latex: '\\begin{pmatrix} {\\Box} & {\\Box} & {\\Box} \\\\ {\\Box} & {\\Box} & {\\Box} \\\\ {\\Box} & {\\Box} & {\\Box} \\end{pmatrix}'
    },
    {
      symbol: 'cmatrix',
      mathML: '<mrow><mtable><mtr><mtd><mi>&square;</mi></mtd><mtd><mi>&#X22EF;</mi></mtd></mtr><mtr><mtd><mi>&square;</mi></mtd><mtd><mi>&#x22EE;</mi></mtd></mtr></mtable></mrow>',
      latex: '\\begin{pmatrix} \\Box & \\dots \\\\ \\Box & \\vdots \\end{pmatrix}'
    },
    {
      symbol: 'choose',
      mathML: '<mrow><mo>(</mo><mfrac linethickness="0"><mrow><mi>&square;</mi></mrow><mrow><mi>&square;</mi></mrow></mfrac><mo>)</mo></mrow>',
      latex: '\\binom{\\Box}{\\Box}'
    },
    {
      symbol: 'cases',
      mathML: '<mrow><mo>{</mo><mtable><mtr><mtd><mi>&square;</mi></mtd><mtd><mi>&square;</mi></mtd></mtr><mtr><mtd><mi>&square;</mi></mtd><mtd><mi>&square;</mi></mtd></mtr></mtable></mrow>',
      latex: '\\begin{cases} \\Box & \\Box \\\\ \\Box & \\Box \\end{cases}'
    },
    {
      symbol: 'qbracket',
      mathML: '<mrow><mo>&langle;</mo><mrow><mi>&square;</mi></mrow><mo stretchy="true">|</mo><mrow><mi>&square;</mi></mrow><mo>&rangle;</mo></mrow></mrow>',
      latex: '\\langle \\Box | \\Box \\rangle'
    },
  ],
  'GreekLetters': [
    { name: "Alpha", mathML: '<mi>α</mi>', latex: '\\alpha',symbol: '<math><mi>α</mi><mi>β</mi></math>', },
    { name: "Beta", mathML: '<mi>β</mi>', latex: '\\beta' },
    { name: "Gamma", mathML: '<mi>γ</mi>', latex: '\\gamma' },
    { name: "Delta", mathML: '<mi>δ</mi>', latex: '\\delta' },
    { name: "Epsilon", mathML: '<mi>ε</mi>', latex: '\\epsilon' },
    { name: "Zeta", mathML: '<mi>ζ</mi>', latex: '\\zeta' },
    { name: "Eta", mathML: '<mi>η</mi>', latex: '\\eta' },
    { name: "Theta", mathML: '<mi>θ</mi>', latex: '\\theta' },
    { name: "Iota", mathML: '<mi>ι</mi>', latex: '\\iota' },
    { name: "Kappa", mathML: '<mi>κ</mi>', latex: '\\kappa' },
    { name: "Lambda", mathML: '<mi>λ</mi>', latex: '\\lambda' },
    { name: "Mu", mathML: '<mi>μ</mi>', latex: '\\mu' },
    { name: "Nu", mathML: '<mi>ν</mi>', latex: '\\nu' },
    { name: "Xi", mathML: '<mi>ξ</mi>', latex: '\\xi' },
    { name: "Omicron", mathML: '<mi>ο</mi>', latex: 'o' },
    { name: "Pi", mathML: '<mi>π</mi>', latex: '\\pi' },
    { name: "Rho", mathML: '<mi>ρ</mi>', latex: '\\rho' },
    { name: "Sigma", mathML: '<mi>σ</mi>', latex: '\\sigma' },
    { name: "Tau", mathML: '<mi>τ</mi>', latex: '\\tau' },
    { name: "Upsilon", mathML: '<mi>υ</mi>', latex: '\\upsilon' },
    { name: "Phi", mathML: '<mi>φ</mi>', latex: '\\phi' },
    { name: "Chi", mathML: '<mi>χ</mi>', latex: '\\chi' },
    { name: "Psi", mathML: '<mi>ψ</mi>', latex: '\\psi' },
    { name: "Omega", mathML: '<mi>ω</mi>', latex: '\\omega' }
  ],
  'MathSymbols': [
    { name: "Sigma", mathML: '<mo>∑</mo>', latex: '\\sum',symbol: '<math><mi>∑</mi><mi>∞</mi></math>',  },
    { name: "Integral", mathML: '<mo>&int;</mo>', latex: '\\int' },
    { name: "Partial Derivative", mathML: '<mo>∂</mo>', latex: '\\partial' },
    { name: "Pi", mathML: '<mo>&pi;</mo>', latex: '\\Pi' },
    { name: "Infinity", mathML: '<mo>&infin;</mo>', latex: '\\infty' },
    { name: "Plus Minus", mathML: '<mo>±</mo>', latex: '\\pm' },
    { name: "Approximately Equal", mathML: '<mo>≈</mo>', latex: '\\approx' },
    { name: "Logical AND", mathML: '<mo>∧</mo>', latex: '\\land' },
    { name: "Logical OR", mathML: '<mo>∨</mo>', latex: '\\lor' },
    { name: "Nabla", mathML: '<mo>∇</mo>', latex: '\\nabla' },
    { name: "Circled Plus", mathML: '<mo>⊕</mo>', latex: '\\oplus' },
    { name: "Circled Times", mathML: '<mo>⊗</mo>', latex: '\\otimes' },
    { name: "Perpendicular", mathML: '<mo>⊥</mo>', latex: '\\perp' },
    { name: "Not Element Of", mathML: '<mo>∉</mo>', latex: '\\notin' },
    { name: "Subset Of", mathML: '<mo>⊆</mo>', latex: '\\subseteq' },
    { name: "Superset Of", mathML: '<mo>⊇</mo>', latex: '\\supseteq' },
    { name: "Empty Set", mathML: '<mo>∅</mo>', latex: '\\emptyset' },
    { name: "Element Of", mathML: '<mo>∈</mo>', latex: '\\in' },
    { name: "Implies", mathML: '<mo>⇒</mo>', latex: '\\Rightarrow' },
    { name: "If and Only If", mathML: '<mo>⇔</mo>', latex: '\\Leftrightarrow' },
    { name: "Symmetric Difference", mathML: '<mo>⊖</mo>', latex: '\\ominus' },
    { name: "Union", mathML: '<mo>∪</mo>', latex: '\\cup' },
    { name: "Intersection", mathML: '<mo>∩</mo>', latex: '\\cap' },
    { name: "Not Equal", mathML: '<mo>≠</mo>', latex: '\\neq' },
    { name: "Right Arrow", mathML: '<mo>→</mo>', latex: '\\rightarrow' },
    { name: "Left Arrow", mathML: '<mo>←</mo>', latex: '\\leftarrow' },
    { name: "Up Arrow", mathML: '<mo>↑</mo>', latex: '\\uparrow' },
    { name: "Down Arrow", mathML: '<mo>↓</mo>', latex: '\\downarrow' },
    { name: "Square Root", mathML: '<mo>√</mo>', latex: '\\sqrt{}' },
    { name: "Cube Root", mathML: '<mo>∛</mo>', latex: '\\sqrt[3]{}' },
    { name: "Angle", mathML: '<mo>∠</mo>', latex: '\\angle' },
    { name: "Perpendicular Angle", mathML: '<mo>⊥</mo>', latex: '\\perp' },
    { name: "Dot Operator", mathML: '<mo>⋅</mo>', latex: '\\cdot' },
    { name: "Proportional To", mathML: '<mo>∝</mo>', latex: '\\propto' },
    { name: "Subset", mathML: '<mo>⊂</mo>', latex: '\\subset' },
    { name: "Superset", mathML: '<mo>⊃</mo>', latex: '\\supset' },
  ],
  'MathSymbols2': [
    { symbol: '<mi>Text</mi>', latex: '{\\Box}', displayName: 'Text', mathML: '<mi >□</mi>' }
  ],
  'MathSymbols3': [
    { symbol: '<mi>LaTex</mi>', latex: '{\\Box}', displayName: 'LaTex' }
  ],  
  'Yelp': [
    { symbol: '<mi>doc</mi>', mathML: '<mo>doc</mo>', url: '/docs/MATH-EDITOR-DOC.doc' },
    { symbol: '<mi>link</mi>', mathML: '<mo>link</mo>', url: 'https://youtu.be/oXgVAVesmSg?feature=shared' }
  ]
};

// Exclude dynamically generated menu items and dialogs
export const excludedElements = [
  "#MathSymbols2",
  "#MathSymbols3",
  ".MuiPopover-root", // Excludes Material UI popups (Menu, Dialog)
  ".MuiDialog-root",  // Excludes Matrix dialog
];

 // 🔹 Move out nested elements from <mi> into <mrow>
 export const fixMiWrapping = (parent) => {
  parent.querySelectorAll("mi").forEach(mi => {
      if (mi.children.length > 0) {
          const mrow = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");

          let textNode = "";
          mi.childNodes.forEach(node => {
              if (node.nodeType === 3) { // Text node
                  textNode += node.nodeValue.trim();
              } else if (node.nodeType === 1) { // Element node (MathML)
                  const clonedNode = document.createElementNS("http://www.w3.org/1998/Math/MathML", node.nodeName);
                  clonedNode.innerHTML = node.innerHTML; // Preserve inner content
                  mrow.appendChild(clonedNode);
              }
          });

          if (textNode) {
              const miText = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
              miText.textContent = textNode;
              mrow.insertBefore(miText, mrow.firstChild);
          }

          mi.replaceWith(mrow);
      }
  });
};

export const cleanMathML = (htmlString) => {
    let cleaned = htmlString;

    // 1. Remove non-MathML elements
    const removeTags = (str) => {
        const tagsToRemove = [
            'span', 'div', 'p', 'b', 'i', 'em', 'strong', 'u', 'strike', 'big', 'small',
            'tt', 'kbd', 'samp', 'var', 'dfn', 'abbr', 'address', 'blockquote', 'dl',
            'dt', 'dd', 'ol', 'ul', 'li', 'form', 'label', 'legend', 'fieldset',
            'select', 'option', 'textarea', 'button', 'table', 'caption', 'th',
            'tr', 'td', 'thead', 'tbody', 'tfoot'
        ];
        let newStr = str;
        tagsToRemove.forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>|<\/${tag}>`, 'gi');
            newStr = newStr.replace(regex, '');
        });
        return newStr;
    };

    cleaned = removeTags(cleaned);

    // 2. Remove non-breaking spaces
    cleaned = cleaned.replace(/&nbsp;/g, '');

    // 3. Remove attributes we don't need
    cleaned = cleaned.replace(/ contenteditable="true"/g, '');
    cleaned = cleaned.replace(/ style="[^"]*"/g, '');

    // 4. Remove existing <math> tags but keep content
    cleaned = cleaned.replace(/<math[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/math>/gi, '');
    cleaned = cleaned.replace(/ xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/g, '');

    // 5. Wrap cleaned content inside a single <math> tag
    cleaned = `<math xmlns="http://www.w3.org/1998/Math/MathML">${cleaned}</math>`;

    // 6. Parse as XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleaned, "text/xml");

    // 🔹 Properly Remove `xmlns` from all inner elements
    doc.documentElement.querySelectorAll("*").forEach(el => {
        if (el.tagName !== "math") {
            el.removeAttribute("xmlns"); // Removes direct `xmlns`
            el.removeAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns"); // ✅ Removes namespace correctly
        }
    });

    // 🔹 Wrap any remaining non-MathML text inside <mtext>
    doc.documentElement.childNodes.forEach(node => {
      if (node.nodeType === 3 && node.nodeValue.trim() !== "") { // Text node
          const mtext = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mtext");
          mtext.textContent = node.nodeValue.trim();
          node.replaceWith(mtext);
      }
    });

    // 🔹 Fix <mi> wrapping issues
    fixMiWrapping(doc.documentElement);

    // 7. Serialize cleaned MathML
    cleaned = new XMLSerializer().serializeToString(doc);
    
    // console.log("cleaned", cleaned);
    cleaned = cleaned.replace(/<mi[^>]*>/g, (match) => {
      return match.replace(/ xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/g, '');
    });
    
    // console.log("cleaned", cleaned);
    return cleaned;
};

export function latexToPlainText(latex) {
  return latex
      .replace(/\s+/g, " ") // Normalize spaces
      .replace(/\^{([^}]*)}/g, "^($1)") // Convert superscripts
      .replace(/_\{([^}]*)}/g, "_($1)") // Convert subscripts
      .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)") // Convert fractions
      .replace(/\\sqrt{([^}]*)}/g, "sqrt($1)") // Convert square roots
      .replace(/\\text{([^}]*)}/g, "$1") // Extract text inside \text{}
      .replace(/\\([a-zA-Z]+)\b/g, "$1") // Remove other LaTeX commands
      .replace(/[{}]/g, ""); // Remove leftover curly braces
}

// prevent the error while deleting the element
export const enforceMathMLStructure = (container) => {
  const elementsToCheck = [
      { tag: "msub", requiredChildren: 2 },
      { tag: "mfrac", requiredChildren: 2 },
      { tag: "mmultiscripts", requiredChildren: 3 },
      { tag: "msubsup", requiredChildren: 3 },
      { tag: "msup", requiredChildren: 2 },
      { tag: "munderover", requiredChildren: 3 },
      { tag: "mover", requiredChildren: 2 },
      { tag: "munder", requiredChildren: 2 }
  ];

  elementsToCheck.forEach(({ tag, requiredChildren }) => {
      container.querySelectorAll(tag).forEach((element) => {
          while (element.children.length < requiredChildren) {
              const placeholder = document.createElement("mi");
              placeholder.textContent = "□";
              placeholder.setAttribute("contenteditable", "true");
              element.appendChild(placeholder);
          }
      });
  });
};

export const unwrapMiTags = (htmlContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const mathElements = doc.querySelectorAll("mi, mo, mn"); // Select mi, mo, mn

  mathElements.forEach((element) => {
    const parent = element.parentNode;
    const children = Array.from(element.childNodes);
    const containsTag = children.some((child) => child.nodeType === 1); // Check if contains elements

    if (containsTag) {
      let firstInsertedElement = null;
      let lastTextNode = "";

      children.forEach((child) => {
        if (child.nodeType === 1) {
          // If it's an element like <mfrac> or <msqrt>
          if (!firstInsertedElement) firstInsertedElement = child;
          parent.insertBefore(child, element);

          // Insert <mo>&nbsp;</mo> after the inserted element for spacing
          const emptyMo = document.createElement('mi');
          emptyMo.innerHTML = '&nbsp;';
          parent.insertBefore(emptyMo, element);
        } else {
          lastTextNode += child.textContent;
        }
      });

      // Handle text characters inside <mi>, <mo>, or <mn>
      if (lastTextNode.length > 1) {
        [...lastTextNode].forEach((char) => {
          const newElement = document.createElement(element.tagName.toLowerCase());
          newElement.textContent = char;
          parent.insertBefore(newElement, firstInsertedElement || element);
        });
      } else if (lastTextNode.length === 1) {
        const newElement = document.createElement(element.tagName.toLowerCase());
        newElement.textContent = lastTextNode;
        parent.insertBefore(newElement, firstInsertedElement || element);
      }

      parent.removeChild(element);
    }
  });

  // Ensure a space <mi> is added after mfrac or msqrt if it's missing
  doc.querySelectorAll("mfrac, msqrt, msup, msubsubsup, mmultiscripts, munderover, mover, munder, mtable").forEach((element) => {
    if (!element.nextSibling || element.nextSibling.tagName !== "MI") {
      console.log("uio");
      
      const emptyMi = document.createElement("mi");
      emptyMi.innerHTML = "&nbsp;";
      element.parentNode.insertBefore(emptyMi, element.nextSibling);
    }
  });

  // Fix empty <mrow> issue
  doc.querySelectorAll("mrow").forEach((mrow) => {
    if (!mrow.innerHTML.trim()) {
      const msqrtParent = mrow.closest("msqrt");
      if (msqrtParent) {
        msqrtParent.remove(); // Remove empty sqrt
      } else {
        mrow.remove(); // Remove empty mrow
      }
    }
  });

  // Prevent <br> being added automatically
  doc.body.querySelectorAll("br").forEach((br) => br.remove());

  return doc.body.innerHTML;
};

export const MenuBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
  borderRadius: '3px',
  padding: theme.spacing(1),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
  borderRadius: 4,
  fontSize: 12, // ✅ Keep font size the same
  padding: "10px 20px", // ✅ Increase padding for larger button
  minWidth: "80px", // ✅ Ensure button width increases
}));