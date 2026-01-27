import { useState } from "react";
import ApiService from "../../apis/ApiService";
import { CustomNavigate } from "../config/navigation";
import { GOOGLE_LOGIN, JWT_TOKEN } from "../config/sessionStorage";
import { addSerialNumber, handleApiCall } from "../config/fieldConfig";
import Swal from "sweetalert2";
import useFetchOnMount from "../config/useFetchOnMount";
import toast from "react-hot-toast";

export const MathEditorService = () => {
  const [data, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
  const [editItemId, setEditItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({}); // State to store edit form data
  const [input, setInput] = useState("");

  const { navigateError403 } = CustomNavigate();

  const fetchData = async () => {
    try {
      const token = JWT_TOKEN();
      const isGoogleLogin = GOOGLE_LOGIN();

      const res = await ApiService.getAllFormulas(token, isGoogleLogin);
      setTableData(res); // Assuming the response contains an array of formulas
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call the custom hook with fetchData
  useFetchOnMount(fetchData);

  const rows = addSerialNumber(data);

  // Function to handle sending data to the iframe
  const sendDataToIframe = (data, formulaName) => {
    const iframe = document.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "loadEditData", formula: data, formulaName: formulaName },
        window.location.origin
      );
    }
  };

  const handleEdit = (id) => () => {
    console.log("Editing row ID:", id);
    
    // Find the selected row by ID
    const selectedRow = data.find((row) => row.id === id);
    console.log(selectedRow?.formula);
    
    if (selectedRow) {
      setEditItemId(id);
      setEditFormData(selectedRow);  // Store row data in state
      setMode("edit"); // Switch to edit mode
      setInput(selectedRow?.formula)
    }
  };

  const handleShare = (id) => () => {
    // Find the selected row by ID
    const selectedRow = data.find((row) => row.id === id);
    const tinyUrl = selectedRow?.tinyUrl;

    if (!tinyUrl) {
      console.error("No URL found for sharing.");
      alert("Invalid share link.");
      return;
    }

    // ✅ Native sharing (Mobile Only)
    if (navigator.share) {
      navigator
        .share({
          title: "Check this out!",
          text: "Here's a formula I wanted to share with you.",
          url: tinyUrl, // Sharing the short link
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // ✅ Copy without `navigator.clipboard`
      const tempInput = document.createElement("input");
      tempInput.value = tinyUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");  // Legacy copy method
      document.body.removeChild(tempInput);

      alert("Link copied!");
    }
  };

  // Function for handling form submissions
  const onSubmitForm = async (formData, action) => {
    try {
      const token = JWT_TOKEN();
      const isGoogleLogin = GOOGLE_LOGIN();

      // Determine the appropriate API action based on the action type
      const apiAction = {
        add: ApiService.addFormulas,
        edit: ApiService.updateFormulas,
        delete: ApiService.updateFormulas,
      }[action];

      // Call the API action and handle the response
      await handleApiCall(
        // Pass appropriate parameters based on the action type
        apiAction(formData, token, isGoogleLogin),
        // Construct success message based on action type
        `${action.charAt(0).toUpperCase()}${action.slice(1)}ed`,
        // Pass form data if action is not delete, otherwise pass null
        action !== "delete" ? formData : null,
        fetchData,
        navigateError403
      );

      setEditItemId(null);
      setEditFormData({});  // Store row data in state
      setMode("add"); // Switch to edit mode
       // Clear the content of the editable area (mathContainer)
    const mathContainer = document.getElementById('mathContainer');
    if (mathContainer) {
      mathContainer.innerHTML = '';  // Clear the content of the math container
    }
    
    } catch (error) {
      // Log error and navigate to error page
      console.error(`Error ${action} form data:`, error);
      navigateError403();
    }
  };

  // Function to handle addition form submission
  const onAddForm = (formData) => onSubmitForm(formData, "add");

  // Function to handle edit form submission
  const onEditForm = (formData) => onSubmitForm(formData, "edit");

  // Function to handle delete form submission
  const handleDelete = (id) => () => {
    console.log("id", id);
    
    if (mode === "edit") {
      toast.error("Deletion is not allowed in the edit mode.", {
        icon: "⚠️",
      });
      return;
    }

    Swal.fire({
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      width: "auto",
    }).then((result) => {
      if (result.isConfirmed) {
        const rowData = data.find((row) => row.id === id); // Find the row data based on the id
        if (rowData) {
          // setEditItemId(id); // Set the edit form state and data
          // setEditFormData(rowData); // Set edit form data
          rowData.deleted = true;
          onSubmitForm(rowData, "delete");
        }
      }
    });
  };

  return {
    rows,
    mode,
    editItemId,
    editFormData,
    onAddForm,
    onEditForm,
    handleEdit,
    handleDelete,
    handleShare,
    sendDataToIframe,
    setMode,
    input, 
    setInput
  };
};
