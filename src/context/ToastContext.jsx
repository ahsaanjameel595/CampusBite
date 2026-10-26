import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const nextToastId = useRef(0);
  const showToast = useCallback((message) => {
    const key = nextToastId.current + 1;
    nextToastId.current = key;
    setToast({ message, key });
    window.setTimeout(() => setToast((current) => current?.key === key ? null : current), 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <div className="toast" role="status" key={toast.key}><span className="toast__icon"><Check size={16} /></span>{toast.message}<button className="icon-button toast__close" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={16} /></button></div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
