import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 1024 * 1024; // 1 MB

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error when a new file is selected
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
      // Upload all chunks
      for (let i = 0; i < totalChunks; i++) {
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
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div>
          <progress value={progress} max="100" />
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Uploaded File Preview */}
      {uploadedFile && (
        <div>
          <p>Uploaded File: {uploadedFile}</p>
          {uploadedFile.endsWith(".jpg") || uploadedFile.endsWith(".png") ? (
            <img
              src={`http://localhost:8000/media/${uploadedFile}`}
              alt="Uploaded"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <a href={`http://localhost:8000/media/${uploadedFile}`} download>
              Download File
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;