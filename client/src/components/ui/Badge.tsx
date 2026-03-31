interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    default: "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950",
    secondary: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
    outline: "border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
