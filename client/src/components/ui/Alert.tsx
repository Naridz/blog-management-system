import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}

export function Alert({ variant = "info", children }: AlertProps) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-zinc-50 border-zinc-200 text-zinc-700",
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
