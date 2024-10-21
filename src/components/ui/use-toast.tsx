import React, { useState } from "react";

interface ToastProps {
  title: string;
  description: string;
}

export const Toast: React.FC<ToastProps> = ({ title, description }) => (
  <div className="toast p-4 mb-2 bg-gray-800 text-white rounded shadow-md">
    <h4 className="font-bold">{title}</h4>
    <p>{description}</p>
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description }: ToastProps) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { title, description }
    ]);

    // Auto-dismiss toast after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1));
    }, 3000);
  };

  return {
    toast,
    toasts
  };
};