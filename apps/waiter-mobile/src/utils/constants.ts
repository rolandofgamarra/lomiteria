/**
 * Network constants for ZarfPizzas.
 * Override with EXPO_PUBLIC_BASE_URL / EXPO_PUBLIC_SOCKET_URL when needed.
 */
const DEFAULT_API_URL = "http://192.168.68.136:3000";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL ?? DEFAULT_API_URL;
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? BASE_URL;
