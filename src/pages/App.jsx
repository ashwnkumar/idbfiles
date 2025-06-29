import React, { useState } from "react";
import About from "./About";
import Files from "./FIles";
import SectionButton from "../components/SectionButton";

const sections = ["files", "about"];



const App = () => {
  const [section, setSection] = useState(sections[0]);

  return (
    <div className="flex flex-col items-center justify-start gap-4 w-full h-full bg-white text-heading font-mono custom-scrollbar">
      <header className="flex flex-col items-center justify-center gap-1 p-2">
        <h3 className="text-3xl font-medium">IDBFiles</h3>
        <p className="text-lg text-secondary">
          A file management system built into your browser
        </p>
      </header>

      <nav className="flex flex-row items-center justify-center gap-2 rounded-full border border-gray p-1">
        {sections.map((sec) => (
          <SectionButton
            key={sec}
            name={sec}
            currentSection={section}
            onClick={setSection}
          />
        ))}
      </nav>

      <main className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
        {section === "files" ? <Files /> : <About />}
      </main>
    </div>
  );
};

export default App;
