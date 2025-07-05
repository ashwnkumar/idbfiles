import React from "react";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-center gap-1 sm:gap-2 py-5 px-4 sm:px-6 text-center text-sm mt-auto text-heading/70 font-light max-w-4xl mx-auto">
      <p className="text-base sm:text-sm">
        A little experiment in making browser storage feel a bit more useful.
      </p>
      <p className="text-base sm:text-sm">
        &copy; {new Date().getFullYear()} IDBFiles. All rights reserved.
        Designed and developed by{" "}
        <a
          href="https://ashwinkumar-dev.web.app"
          target="_blank"
          rel="noreferrer"
          className="text-brand underline hover:text-brand-dark transition"
        >
          Ashwin Kumar
        </a>
      </p>
    </footer>
  );
};

export default Footer;
