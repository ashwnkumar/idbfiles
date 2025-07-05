import React, { useEffect, useState } from "react";
import About from "./About";
import Files from "./FIles";
import SectionButton from "../components/SectionButton";
import Button from "../components/Button";
import { Moon, Sun } from "lucide-react";

const sections = ["files", "about"];

const App = () => {
  const [section, setSection] = useState(sections[0]);

  return (
    <div className="flex flex-col items-center justify-start gap-4 w-full h-screen  px-4 md:px-8 custom-scrollbar">
      <nav className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 rounded-full border border-gray p-1 bg-white shadow-sm">
        {sections.map((sec) => (
          <SectionButton
            key={sec}
            name={sec}
            currentSection={section}
            onClick={setSection}
          />
        ))}
      </nav>

      <main className="w-full max-w-6xl flex flex-col items-center justify-start gap-4">
        {section === "files" ? <Files /> : <About />}
      </main>
    </div>
  );
};

export default App;
