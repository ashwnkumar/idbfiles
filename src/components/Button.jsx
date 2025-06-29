import { Link } from "react-router-dom";

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  navTo,
  variant = "primary", // Default variant
  icon: Icon,
  label,
  type = "button",
}) => {
  // Define variant styles
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover",
    secondary: "text-brand hover:bg-hover",
    danger: "bg-danger text-white hover:bg-danger-hover",
    outline: "border border-gray text-secondary hover:bg-hover",
    icon: "!rounded-full hover:bg-hover !p-1.5",
  };

  const commonClasses = `w-fit flex items-center justify-center whitespace-nowrap w-fit px-4 py-2 font-medium ${
    !disabled && "active:translate-y-0.5 transition-transform"
  }   cursor-pointer rounded-lg disabled:bg-brand-disabled disabled:cursor-not-allowed gap-2 
    ${variants[variant] || variants.primary} 
    ${loading ? "pointer-events-none cursor-not-allowed" : ""} 
    ${className}`;

  if (navTo) {
    return (
      <Link to={navTo} className={commonClasses}>
        {Icon && <Icon />}
        {label && <span>{label}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={commonClasses}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      ) : (
        <>
          {Icon && <Icon />}
          {label && !children && <span>{label}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
