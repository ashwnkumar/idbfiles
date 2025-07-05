import React from "react";

const About = () => {
  return (
    <div className="space-y-6 text-start w-full max-w-2xl px-4 sm:px-6 mx-auto ">
      <h3 className="text-2xl sm:text-3xl font-medium text-center">
        Welcome to IDBFiles
      </h3>

      <p className="text-base sm:text-lg">
        IDBFiles is a browser-based file manager. It lets you upload files, view
        them, download them, or delete them — all without sending anything to a
        server. Everything happens right in your browser.
      </p>

      <h2 className="text-xl sm:text-2xl font-medium">🚀 How it works</h2>
      <p className="text-base sm:text-lg">
        The app uses your browser’s built-in database system called{" "}
        <strong>IndexedDB</strong>. When you upload a file, it's stored locally
        in your browser. No cloud storage, no network calls — just local,
        persistent data tied to your browser and device.
      </p>
      <p className="text-base sm:text-lg">
        The files will stay there until you delete them or clear your browser
        data. Even if you close the tab or shut down your computer, your files
        will still be available the next time you visit.
      </p>

      <h2 className="text-xl sm:text-2xl font-medium">🧭 What you can do</h2>
      <ul className="list-disc pl-6 text-base sm:text-lg">
        <li>Upload files directly from your device</li>
        <li>View a list of your uploaded files</li>
        <li>Preview images and supported document types</li>
        <li>Download files whenever you need them</li>
        <li>Delete individual files, or clear everything at once</li>
      </ul>

      <h2 className="text-xl sm:text-2xl font-medium">🔐 Privacy</h2>
      <p className="text-base sm:text-lg">
        Since everything is stored in your browser, nothing is uploaded or
        shared with any server. This also means that the data is tied to your
        browser and device. If you switch browsers or clear site data, the
        stored files will be lost.
      </p>
    </div>
  );
};

export default About;
