import React, { useState } from 'react';
import './ChooseFile.css'; 

const ChooseFile = ({ label, onChange, onRemove, accept }) => {
  const [fileName, setFileName] = useState(''); // State to store selected filename

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name); // Update filename state
      onChange(selectedFile); // Call provided onChange function with the file
    }
  };

  // const handleRemoveFile = () => {
  //   setFileName('');
  //   onRemove();
  // };

  return (
    <div className="file-input-container">
      <label htmlFor="file-input">
        {label}
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
      <span className="file-name w-80">{fileName ? fileName : "No file chosen"}</span>

      {/* {fileName && (
        <button type="button" className="remove-button" onClick={handleRemoveFile}>
          Remove
        </button>
      )} */}
    </div>
  );
};

export default ChooseFile;