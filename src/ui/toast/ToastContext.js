import React, {createContext, useContext, useState, useCallback} from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({children}) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, duration = 3000) => {
    const toastId = ++id;

    setToasts(prev => [...prev, {id: toastId, message}]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
