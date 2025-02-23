import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 1024 * 1024; // 1 MB

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [lastUploadedChunk, setLastUploadedChunk] = useState(-1);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error when a new file is selected
    setLastUploadedChunk(-1); // Reset last uploaded chunk when a new file is selected
  };

  // Upload a single chunk
  const uploadChunk = async (chunk, chunkIndex, totalChunks) => {
    const formData = new FormData();
    formData.append("file", chunk); // Append the file chunk
    formData.append("chunkIndex", chunkIndex); // Append the chunk index
    formData.append("totalChunks", totalChunks); // Append the total number of chunks
    formData.append("fileName", file.name); // Append the file name

    try {
      const response = await axios.post("http://localhost:8000/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct Content-Type
        },
      });
      setProgress(((chunkIndex + 1) / totalChunks) * 100); // Update progress
      setLastUploadedChunk(chunkIndex); // Update the last uploaded chunk
      return response.data; // Return the server response
    } catch (error) {
      console.error("Error uploading chunk:", error);
      throw error; // Rethrow the error to handle it in the main function
    }
  };

  // Handle the full file upload process
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // Calculate totalChunks

    try {
      // Start uploading from the last uploaded chunk
      for (let i = lastUploadedChunk + 1; i < totalChunks; i++) {
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE); // Split the file into chunks
        const response = await uploadChunk(chunk, i, totalChunks); // Upload each chunk

        // If this is the last chunk, set the uploaded file
        if (i === totalChunks - 1 && response.success) {
          setUploadedFile(file.name);
        }
      }
    } catch (error) {
      setError("An error occurred during upload. Please try again.");
      console.error("Error completing upload:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>File Upload</h1>
      <input type="file" onChange={handleFileChange} style={styles.fileInput} />
      <button onClick={handleUpload} style={styles.uploadButton}>
        Upload
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div style={styles.progressContainer}>
          <progress value={progress} max="100" style={styles.progressBar} />
          <span style={styles.progressText}>{Math.round(progress)}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={styles.errorText}>{error}</p>}

      {/* Uploaded File Preview */}
      {uploadedFile && (
        <div style={styles.uploadedFileContainer}>
          <p style={styles.uploadedFileText}>Uploaded File: {uploadedFile}</p>
          {uploadedFile.endsWith(".jpg") || uploadedFile.endsWith(".png") ? (
            <img
              src={`http://localhost:8000/media/${uploadedFile}`}
              alt="Uploaded"
              style={styles.uploadedImage}
            />
          ) : (
            <a
              href={`http://localhost:8000/media/${uploadedFile}`}
              download
              style={styles.downloadLink}
            >
              Download File
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  fileInput: {
    marginBottom: "20px",
  },
  uploadButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  progressContainer: {
    width: "300px",
    marginTop: "20px",
  },
  progressBar: {
    width: "100%",
  },
  progressText: {
    display: "block",
    textAlign: "center",
    marginTop: "10px",
  },
  errorText: {
    color: "red",
    marginTop: "20px",
  },
  uploadedFileContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  uploadedFileText: {
    fontSize: "1.2rem",
  },
  uploadedImage: {
    maxWidth: "10%",
    marginTop: "10px",
  },
  downloadLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default FileUpload;