import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.body.setAttribute("theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.setAttribute("theme", theme);
  }, [theme]);

  return (
    <header className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-1 py-4 w-full max-w-4xl px-4 relative">
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-medium">IDBFiles</h3>
        <p className="text-base sm:text-lg text-secondary">
          A file management system built into your browser
        </p>
      </div>
      <div className="absolute right-0 top-2">
        <Button
          variant="icon"
          icon={theme === "dark" ? Sun : Moon}
          onClick={toggleTheme}
        />
      </div>
    </header>
  );
};

export default Navbar;
