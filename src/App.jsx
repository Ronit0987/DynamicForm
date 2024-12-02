import React, { useState } from "react";
import "./App.css";

const DynamicForm = () => {
  const [formStructure, setFormStructure] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [progress, setProgress] = useState(0);
  const [selectedForm, setSelectedForm] = useState("");

  const mockApiResponse = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const handleFormSelection = (event) => {
    const selected = event.target.value;
    setSelectedForm(selected);
    setFormStructure(mockApiResponse[selected]?.fields || []);
    setFormData({});
    setProgress(0);
    setErrorMessages({});
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      calculateProgress(updatedData);
      return updatedData;
    });
    setErrorMessages((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const calculateProgress = (data) => {
    const requiredFields = formStructure.filter((field) => field.required);
    const filledFields = requiredFields.filter((field) => data[field.name]);
    setProgress(Math.round((filledFields.length / requiredFields.length) * 100));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    const newErrors = {};

    formStructure.forEach((field) => {
      if (field.required && !formData[field.name]) {
        isValid = false;
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (isValid) {
      setSubmittedData((prevData) => [...prevData, formData]);
      setFormData({});
      setFormStructure([]);
      setProgress(0);
      setSelectedForm("");
      alert("Form submitted successfully!");
    } else {
      setErrorMessages(newErrors);
    }
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
    alert("Entry deleted successfully.");
  };

  return (
    <div className="dynamic-form-container">
      <header>
        <h1>Dynamic Form</h1>
      </header>

      <div className="form-selector">
        <label htmlFor="formType">Select Form Type:</label>
        <select id="formType" value={selectedForm} onChange={handleFormSelection}>
          <option value="">--Select--</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {formStructure.length > 0 && (
        <form onSubmit={handleSubmit} className="dynamic-form">
          {formStructure.map((field) => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>{field.label}:</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">--Select--</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {errorMessages[field.name] && (
                <span className="error-message">{errorMessages[field.name]}</span>
              )}
            </div>
          ))}

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${progress}%`, backgroundColor: progress === 100 ? "green" : "blue" }}
            ></div>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Data</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(submittedData[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>
        <p>&copy; 2024 Dynamic Form Inc.</p>
      </footer>
    </div>
  );
};

export default DynamicForm;
