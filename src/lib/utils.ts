import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend API URL for the given endpoint
 * In development: uses Vite proxy (/api/...)
 * In production: uses full backend URL from VITE_BACKEND_URL
 */
export function getBackendUrl(endpoint: string): string {
  const isDevMode = import.meta.env.DEV;
  
  if (isDevMode) {
    // In development, use the Vite proxy
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `/api${path}`;
  } else {
    // In production, use the full backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('❌ VITE_BACKEND_URL is not defined in environment variables');
      return endpoint;
    }
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${backendUrl}${path}`;
  }
}

