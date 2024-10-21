import React from "react";

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border border-gray-200 p-4 rounded shadow-md">
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);