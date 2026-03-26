interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ text = "Loading...", size = "md" }: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className={`${sizes[size]} border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin`} />
      {text && <span className="text-sm text-zinc-600">{text}</span>}
    </div>
  );
}

export function LoadingPage({ text }: { text?: string }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 flex items-center justify-center">
      <div className="flex items-center gap-3 px-5 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        <span className="text-zinc-700 font-medium">{text || "Loading..."}</span>
      </div>
    </div>
  );
}
