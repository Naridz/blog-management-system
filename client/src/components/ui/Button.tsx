import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-400",
    ghost: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
