import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DropZoneTables() {
  const [uploadResults, setUploadResults] = useState([]); // State to hold results for each file

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === "text/csv") {
        // Remove .csv extension from the filename
        const tableName = file.name.replace(".csv", "");

        // Prepare the form data
        const formData = new FormData();
        formData.append("table_name", tableName);
        formData.append("file", file, file.name);

        // API request options
        const requestOptions = {
          method: "POST",
          headers: new Headers(),
          body: formData,
          redirect: "follow",
        };

        // Make the API call for each file
        fetch("/api/upload", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            // Update the result state for each file
            setUploadResults((prevResults) => [
              ...prevResults,
              { fileName: file.name, result },
            ]);
          })
          .catch((error) => {
            // Handle error and update state
            setUploadResults((prevResults) => [
              ...prevResults,
              { fileName: file.name, result: "Error: " + error },
            ]);
          });
      } else {
        console.log("File type not supported. Please upload a JSON file.");
      }
    });
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "application/json": [".json"],
  //   },
  // });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });
  return (
    <div
      className="uploadContainer"
      style={{ background: "white", padding: "2%", borderRadius: "15px" }}
    >
      <h4>Add information to tables</h4>
      <div {...getRootProps()} style={styles.dropzone}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop CSV files here, or click to select files</p>
        )}
      </div>

      {/* Display the results for each uploaded file */}
      <div style={styles.results}>
        {uploadResults.map((upload, index) => (
          <p key={index}>
            File: <strong>{upload.fileName}</strong> - Result: {upload.result}
          </p>
        ))}
      </div>
    </div>
  );
}

// Basic styling for the dropzone and results
const styles = {
  dropzone: {
    border: "2px dashed #0087F7",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    margin: "10px",
  },
  results: {
    marginTop: "20px",
  },
};
