const SectionButton = ({ name, currentSection, onClick }) => {
  const isActive = currentSection === name;
  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      aria-pressed={isActive}
      className={`px-4 py-2 rounded-full cursor-pointer  ${
        isActive ? "bg-brand text-white " : ""
      }`}
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </button>
  );
};

export default SectionButton;
