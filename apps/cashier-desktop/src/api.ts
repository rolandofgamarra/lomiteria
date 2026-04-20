import type { ActiveOrder, Overview, RevenuePoint, Session, TopProduct } from "./types";

function resolveApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return "http://localhost:3000";
}

export const API_BASE_URL = resolveApiBaseUrl();

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Unable to login");
  }

  return response.json() as Promise<Session>;
}

export function getOverview(token: string): Promise<Overview> {
  return request<Overview>("/dashboard/overview", token);
}

export function getAnalytics(token: string): Promise<{
  weeklyRevenue: RevenuePoint[];
  monthlyRevenue: RevenuePoint[];
  topProducts: TopProduct[];
}> {
  return request("/dashboard/analytics", token);
}

export function getActiveOrders(token: string): Promise<ActiveOrder[]> {
  return request<ActiveOrder[]>("/orders/active", token);
}

export function processPayment(
  token: string,
  payload: { orderId: number; method: "CASH" | "DEBIT_CARD" | "CREDIT_CARD" | "TRANSFER" | "QR" }
): Promise<{ message: string }> {
  return request("/payments", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
