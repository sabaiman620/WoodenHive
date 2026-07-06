export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiUrl = (pathname) =>
  `${API_BASE_URL}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
