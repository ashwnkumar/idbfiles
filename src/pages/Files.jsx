import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ModalComponent from "../components/ModalComponent";
import Button from "../components/Button";
import { Download, Eye, Trash2 } from "lucide-react";
import FileUpload from "../components/FileUpload";

const DB_NAME = "IDBFiles";
const DB_VERSION = 1;
const STORE_NAME = "files";

const fileIcons = {
  pdf: "/icons/pdf.png",
  doc: "/icons/doc.png",
  docx: "/icons/doc.png",
  xls: "/icons/xls.png",
  xlsx: "/icons/xls.png",
  jpeg: "/icons/jpg.png",
  jpg: "/icons/jpg.png",
  png: "/icons/png.png",
  svg: "/icons/svg.png",
  gif: "/icons/gif.png",
  mp3: "/icons/music.png",
  mp4: "/icons/video.png",
};

const getFileIcon = (file) => {
  if (!file) return "/icons/default.png";
  const ext = file.name.split(".").pop().toLowerCase();
  return fileIcons[ext] || "/icons/default.png";
};

const isImage = (type) => type?.startsWith("image/");

const getPreviewData = (file) => {
  const isImg = isImage(file?.type);
  const blob = new Blob([file?.content], { type: file?.type });
  const url = URL.createObjectURL(blob);
  return { isImg, url };
};

const Files = () => {
  const [db, setDb] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [clearModal, setClearModal] = useState(false);

  useEffect(() => {
    const openDB = async () => {
      try {
        const db = await openDatabase();
        setDb(db);
        const files = await getAllFiles(db);
        setFiles(files);
      } catch (error) {
        toast.error("Failed to open IndexedDB");
      }
    };
    openDB();
  }, []);

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getAllFiles = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !db) {
      toast.error(
        "Something went wrong. Please try again or refresh if the issue persists."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = {
        name: file.name,
        type: file.type,
        content: reader.result,
      };

      try {
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, "readwrite");
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put(fileData);
          request.onsuccess = resolve;
          request.onerror = () => reject(request.error);
        });

        toast.success("File uploaded successfully");
        const files = await getAllFiles(db);
        setFiles(files);
      } catch (error) {
        toast.error("Failed to upload file");
      }
    };

    reader.onerror = (error) => {
      toast.error("Error reading file");
      console.error(error);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = (file) => {
    try {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const handleDeleteFile = async (id) => {
    if (!db) return;
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
      toast.success("File deleted");
      const updatedFiles = await getAllFiles(db);
      setFiles(updatedFiles);
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleClearStorage = () => {
    try {
      indexedDB.deleteDatabase(DB_NAME);
      setFiles([]);
      setDb(null);
      setClearModal(false);
      toast.success("Storage cleared successfully");
    } catch (error) {
      toast.error("Failed to clear storage");
    }
  };

  const renderPreviewContent = (file) => {
    const { url } = getPreviewData(file);
    switch (true) {
      case file?.type === "application/pdf":
        return (
          <iframe src={url} title="PDF Preview" width="100%" height="700px" />
        );
      case file?.type.startsWith("video/"):
        return <video controls src={url} className="w-full" />;
      case file?.type.startsWith("audio/"):
        return <audio controls src={url} className="w-full" />;
      case file?.type.startsWith("text/"):
        const text = new TextDecoder().decode(file?.content);
        return (
          <pre className="whitespace-pre-wrap p-2 bg-gray-100 rounded max-h-96 overflow-auto">
            {text}
          </pre>
        );
      case file?.type.startsWith("image/"):
        return (
          <img
            src={url}
            alt="preview"
            className="object-contain w-full h-full"
          />
        );
      default:
        return <p>Preview not available for this file type.</p>;
    }
  };

  const deleteModalButtons = [
    {
      label: "Cancel",
      onClick: () => setDeleteModal(null),
      variant: "outline",
    },
    {
      label: "Delete",
      onClick: () => {
        handleDeleteFile(deleteModal);
        setDeleteModal(null);
      },
      variant: "danger",
    },
  ];

  const clearModalButtons = [
    {
      label: "Cancel",
      onClick: () => setClearModal(false),
      variant: "outline",
    },
    {
      label: "Clear",
      onClick: handleClearStorage,
      variant: "danger",
    },
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center  justify-between mb-5 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-medium text-center sm:text-left w-full whitespace-nowrap">
          {files.length > 0
            ? "Find your files here"
            : "No files added. Click the button to upload"}
        </h1>

        {files.length > 0 && (
          <Button
            icon={Trash2}
            label="Clear Storage"
            onClick={() => setClearModal(true)}
            variant="danger"
          />
        )}
      </div>

      <FileUpload handleUpload={handleUpload} />

      <ul className="my-4 flex flex-col items-center justify-center w-full gap-3">
        {files.map((file) => {
          const { isImg, url } = getPreviewData(file);

          return (
            <li
              key={file.id}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-hover/50 p-2 rounded gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-2 w-full">
                {isImg ? (
                  <img
                    src={url}
                    alt="preview"
                    className="size-10 object-cover rounded"
                  />
                ) : (
                  <img src={getFileIcon(file)} alt="icon" className="size-10" />
                )}
                <span
                  onClick={() => setPreviewFile(file)}
                  className="hover:underline underline-offset-4 cursor-pointer break-words"
                >
                  {file.name}
                </span>
              </div>

              <div className="flex self-end sm:self-auto">
                <Button
                  icon={Download}
                  onClick={() => handleDownload(file)}
                  variant="secondary"
                />
                <Button
                  icon={Eye}
                  onClick={() => setPreviewFile(file)}
                  variant="secondary"
                  className="text-success"
                />
                <Button
                  icon={Trash2}
                  onClick={() => setDeleteModal(file.id)}
                  variant="secondary"
                  className="text-danger"
                />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modals */}
      <ModalComponent
        title="Delete File?"
        message="Are you sure you want to delete this file? This action cannot be undone."
        buttons={deleteModalButtons}
        isOpen={deleteModal}
        setIsOpen={setDeleteModal}
      />

      <ModalComponent
        isOpen={previewFile}
        setIsOpen={setPreviewFile}
        title={`Preview: ${previewFile?.name}`}
      >
        {renderPreviewContent(previewFile)}
      </ModalComponent>

      <ModalComponent
        isOpen={clearModal}
        setIsOpen={setClearModal}
        title="Clear Storage?"
        message="Are you sure you want to clear the storage? This action cannot be undone."
        buttons={clearModalButtons}
      />
    </div>
  );
};

export default Files;
