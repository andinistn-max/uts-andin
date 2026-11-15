import { createContext, useContext, useRef, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useNotifications } from "./NotificationContext";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const { add } = useNotifications();
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  // Setiap aksi: tampil sebagai toast + tersimpan di daftar notifikasi
  const notify = useCallback(
    (message, type = "success") => {
      add(message);
      setToast({ message, type, key: Date.now() });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 2600);
    },
    [add]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <div key={toast.key} className={`toast ${toast.type}`}>
          {toast.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
