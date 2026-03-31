import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}

export function Alert({ variant = "info", children }: AlertProps) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-200",
    success: "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-200",
    info: "bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-200",
  };

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-xl ${styles[variant]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}
