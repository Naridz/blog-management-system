interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    default: "bg-zinc-900 text-white",
    secondary: "bg-zinc-100 text-zinc-700",
    outline: "border border-zinc-200 text-zinc-700",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
