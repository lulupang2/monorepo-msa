"use client";

import { useToastStore } from "../../lib/toastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border-l-4 animate-in slide-in-from-right-10 fade-in duration-300",
            toast.type === "success" && "bg-white dark:bg-slate-900 border-emerald-500 text-slate-800 dark:text-slate-100",
            toast.type === "error" && "bg-white dark:bg-slate-900 border-rose-500 text-slate-800 dark:text-slate-100",
            toast.type === "info" && "bg-white dark:bg-slate-900 border-indigo-500 text-slate-800 dark:text-slate-100"
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === "success" && <CheckCircle2 className="text-emerald-500" size={20} />}
            {toast.type === "error" && <AlertCircle className="text-rose-500" size={20} />}
            {toast.type === "info" && <Info className="text-indigo-500" size={20} />}
          </div>
          <p className="text-sm font-bold flex-1 leading-snug">{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
