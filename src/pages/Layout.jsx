import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center bg-white text-heading font-custom custom-scrollbar w-full px-4 md:px-6">
    <Navbar />

    <main className="flex-1 flex flex-col items-center justify-start w-full max-w-4xl py-6 sm:py-8">
      {children}
    </main>

    <Footer />
  </div>
);

export default Layout;
