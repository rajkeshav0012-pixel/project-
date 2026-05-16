import { useState } from "react";
import { uploadAPI } from "../lib/api";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState("");

  const doUpload = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);
    setUploadStatus(null);

    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      setUploadStatus("error");
      setStatusMsg("Please log in to upload files.");
      setIsUploading(false);
      return;
    }

    try {
      const { data } = await uploadAPI.uploadFile(file);
      setUploadStatus("success");
      setStatusMsg(`✓ Uploaded: ${data.file.originalName}`);
    } catch (err) {
      setUploadStatus("error");
      setStatusMsg(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) doUpload(file);
  };

  const statusColor =
    uploadStatus === "success" ? "var(--accent-green)" : "#ef4444";

  return (
    <div
      className="glass-card mt-4 transition-all duration-300"
      style={{
        padding: "24px",
        border: isDragging
          ? "2px dashed var(--accent-purple)"
          : "1px solid var(--border-subtle)",
        background: isDragging
          ? "rgba(139, 92, 246, 0.06)"
          : "var(--bg-card)",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="file-upload-input"
        className="flex flex-col items-center gap-3 cursor-pointer"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          {isUploading ? "⏳" : "📎"}
        </div>

        {statusMsg ? (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: statusColor }}>
              {statusMsg}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Click or drag to upload another
            </p>
          </div>
        ) : isUploading ? (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--accent-purple)" }}>
              Uploading {fileName}...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Drop study files here or{" "}
              <span style={{ color: "var(--accent-purple)" }}>browse</span>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              PDF, DOCX, TXT, Images — max 10MB
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          {["PDF", "DOCX", "TXT", "IMG"].map((type) => (
            <span
              key={type}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(0, 0, 0, 0.03)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {type}
            </span>
          ))}
        </div>
      </label>

      <input
        id="file-upload-input"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        disabled={isUploading}
      />
    </div>
  );
}
