import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ModalComponent from "../components/ModalComponent";
import Button from "../components/Button";
import { CircleQuestionMark, Download, Eye, Trash2 } from "lucide-react";
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

const Files = ({ setLoading }) => {
  const [db, setDb] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [clearModal, setClearModal] = useState(false);
  const [usage, setUsage] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    const openDB = async () => {
      try {
        setLoading(true);
        const db = await openDatabase();
        setDb(db);
        const files = await getAllFiles(db);
        setFiles(files);
      } catch (error) {
        console.error("Failed to open IndexedDB", error);
        toast.error("Failed to open IndexedDB");
      } finally {
        setLoading(false);
      }
    };
    openDB();
  }, []);

  const getStorageData = async () => {
    const { usage, quota } = await navigator.storage.estimate();
    const usedMB = (usage / 1024 / 1024).toFixed(2);
    const totalMB = (quota / 1024 / 1024).toFixed(2);
    const percent = ((usage / quota) * 100).toFixed(2);

    return {
      usedMB: usedMB,
      totalMB: totalMB,
      percent: percent,
    };
  };

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      setLoading(true);
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

      request.onsuccess = () => {
        setLoading(false);
        resolve(request.result);
      };
      request.onerror = () => {
        setLoading(false);
        reject(request.error);
      };
    });
  };

  const getAllFiles = (db) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        setLoading(false);
        resolve(request.result);
      };
      request.onerror = () => {
        setLoading(false);
        reject(request.error);
      };
    });
  };

  const handleUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    if (!file || !db) {
      toast.error(
        "Something went wrong. Please try again or refresh if the issue persists."
      );
      setLoading(false);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size limit exceeded. Maximum size is 100MB.");
      setLoading(false);
      return;
    }

    const fileData = {
      name: file.name,
      type: file.type,
      content: file,
    };

    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(fileData);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      toast.success("File uploaded successfully");
      const files = await getAllFiles(db);
      setFiles(files);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file) => {
    try {
      setLoading(true);
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (id) => {
    if (!db) return;
    try {
      setLoading(true);
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
      console.error("Error deleting file", error);
      toast.error("Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    try {
      setLoading(true);
      indexedDB.deleteDatabase(DB_NAME);
      setFiles([]);
      setDb(null);
      setClearModal(false);
      toast.success("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage", error);
      toast.error("Failed to clear storage");
    } finally {
      setLoading(false);
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

  const truncateText = (name, max = 100) => {
    if (name.length <= max) return name;
    const ext = name.split(".").pop();
    const prefix = name.slice(0, max - ext.length - 5); // 5 for '...'
    return `${prefix}...${ext}`;
  };

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const usage = await getStorageData();
        setUsage(usage);
      } catch (error) {
        console.error("Error fetching usage", error);
      }
    };

    fetchUsage();
  }, [files]);

  console.log("usage for this device", usage);

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
        <h1 className="text-xl sm:text-2xl font-medium text-center sm:text-left w-full ">
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

      <div className="space-y-2">
        <FileUpload handleUpload={handleUpload} />
        <p className="flex items-center justify-between text-sm text-heading/70">
          <span>
            Storage Used: {usage?.usedMB || 0} MB | Total Storage Available:{" "}
            {usage?.totalMB || 0} MB | Percentage Used: {usage?.percent || 0}%
          </span>
          <Button
            icon={CircleQuestionMark}
            variant="icon"
            onClick={() => setStorageInfo(true)}
          />
        </p>
      </div>

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
                  {truncateText(file.name)}
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
      <ModalComponent
        isOpen={storageInfo}
        setIsOpen={setStorageInfo}
        title="📦 How Storage Works in Your Browser"
      >
        <>
          <div className="p-6 max-w-lg mx-auto">
            <p className="mb-4">
              When you upload files using this app, they’re saved inside your
              browser using something called <strong>IndexedDB</strong> — kind
              of like a private storage locker just for this site.
            </p>

            <h3 className="text-xl font-semibold mb-2">
              🧠 So how much space do you get?
            </h3>
            <p className="mb-2">
              That depends on your browser, device, and available disk space,
              but here’s the general idea:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-1">
              <li>
                Modern browsers (like Chrome, Firefox, Edge) usually allow this
                site to use up to <strong>10%–50%</strong> of your available
                disk space.
              </li>
              <li>
                Mobile browsers and Safari can be a bit more strict — sometimes
                limiting storage to just <strong>50MB–200MB</strong> total.
              </li>
              <li>
                Some browsers don't tell us exactly how much you can store — and
                they might stop storing files without warning if the limit is
                hit.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              📊 Why doesn’t the limit feel consistent?
            </h3>
            <p className="mb-4">
              Your browser is smart-ish. It might evict older data or cut off
              large uploads if you’re close to the limit.
            </p>
            <p className="mb-6">
              It’s like a landlord that sometimes just says: “You’ve got enough
              stuff. No more.”
            </p>

            <h3 className="text-xl font-semibold mb-2">
              🧹 Can I free up space?
            </h3>
            <p>
              Yep! Hit Clear Storage to delete everything you’ve uploaded and
              reset your storage space. (This only affects this app.)
            </p>
          </div>
        </>
      </ModalComponent>
    </div>
  );
};

export default Files;
