interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 resize-y min-h-[160px] ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
