import React, { useRef, useState } from "react";

const FileUpload = ({ handleUpload }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  return (
    <label
      className={`bg-main flex flex-col items-center justify-center w-full p-10 py-15 text-center border-2 ${
        isDragging ? "border-brand bg-brand" : "border-gray"
      } border-dashed rounded-lg cursor-pointer hover:border-brand transition`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center ">
        <p className="text-xl">Drag and drop or click to upload</p>
        <p className="text-heading/70">Maximum file size: 100MB</p>
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          handleUpload(e);
          e.target.value = null;
        }}
        className="hidden"
      />
    </label>
  );
};

export default FileUpload;
