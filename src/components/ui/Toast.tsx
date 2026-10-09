import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-600",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export const showToast = (message: string, type: ToastType = "success") => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("app-toast", {
      detail: { message, type },
    })
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: ToastType }>;
      const item = customEvent.detail;

      if (!item?.message) return;

      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message: item.message, type: item.type ?? "success" }]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 3200);
    };

    window.addEventListener("app-toast", handleToast);

    return () => {
      window.removeEventListener("app-toast", handleToast);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg ${toastStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
