/**
 * Button Component
 *
 * Props:
 * variant: primary | secondary | outline
 * size: sm | md | lg
 * disabled: boolean
 * onClick: function
 * children: button text/content
 */

function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}) {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-green-600 text-green-600",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg transition ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;