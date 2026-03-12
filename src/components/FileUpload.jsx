import { useState } from "react";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <div
      className="glass-card mt-4 transition-all duration-300"
      style={{
        padding: "20px",
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
          📎
        </div>

        {fileName ? (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--accent-green)" }}>
              ✓ {fileName}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Drop study files here or <span style={{ color: "var(--accent-purple)" }}>browse</span>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              PDF, DOCX, TXT, Images
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          {["PDF", "DOCX", "TXT", "IMG"].map((type) => (
            <span
              key={type}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
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
      />
    </div>
  );
}
