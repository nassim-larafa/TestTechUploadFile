import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB (pour notre 3 GB fichier)

/* cette fonction on peut l'utiliser si on veut optimiser le chnuk-size selon le taille du notre fichier
const getChunkSize = (fileSize) => {
  if (fileSize < 100 * 1024 * 1024) { // Less than 100 MB
    return 1 * 1024 * 1024; // 1 MB
  } else if (fileSize < 1024 * 1024 * 1024) { // Less than 1 GB
    return 5 * 1024 * 1024; // 5 MB
  } else { // 1 GB or larger
    return 10 * 1024 * 1024; // 10 MB
  }
};*/

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection to catch expeptions when new file is selected 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Reset error when a new file is selected
  };


  const saveUploadedChunks = (fileName, uploadedChunks) => {
    localStorage.setItem(fileName, JSON.stringify(uploadedChunks));
  };
  
  const getUploadedChunks = (fileName) => {
    const uploadedChunks = localStorage.getItem(fileName);
    return uploadedChunks ? JSON.parse(uploadedChunks) : [];
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


  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
  
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadedChunks = getUploadedChunks(file.name);
  
    try {
      for (let i = 0; i < totalChunks; i++) {
        if (uploadedChunks.includes(i)) {
          // Skip already uploaded chunks
          setProgress(((i + 1) / totalChunks) * 100);
          continue;
        }
  
        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const response = await uploadChunk(chunk, i, totalChunks);
  
        // Mark this chunk as uploaded
        uploadedChunks.push(i);
        saveUploadedChunks(file.name, uploadedChunks);
  
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