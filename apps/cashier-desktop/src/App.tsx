import React, { useEffect, useMemo, useState } from "react";
import AuthCard from "./components/AuthCard";
import MetricCard from "./components/MetricCard";
import RevenueChart from "./components/RevenueChart";
import OrdersTable from "./components/OrdersTable";
import { API_BASE_URL, getActiveOrders, getAnalytics, getOverview, login, processPayment } from "./api";
import type { ActiveOrder, Overview, RevenuePoint, Session, TopProduct } from "./types";

const storedSession = (): Session | null => {
  const raw = localStorage.getItem("cashier_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [weeklyRevenue, setWeeklyRevenue] = useState<RevenuePoint[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenuePoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [paymentTarget, setPaymentTarget] = useState<ActiveOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "DEBIT_CARD" | "CREDIT_CARD" | "TRANSFER" | "QR">("CASH");

  const token = session?.token ?? "";

  const metrics = useMemo(() => {
    if (!overview) {
      return [];
    }

    return [
      {
        label: "Ingresos acumulados",
        value: `Gs ${overview.revenue.toLocaleString("es-PY")}`,
        note: "Venta total registrada en caja",
      },
      {
        label: "Pedidos activos",
        value: overview.activeOrders.toString(),
        note: "Pendientes, en preparación o entregados",
      },
      {
        label: "Mesas ocupadas",
        value: overview.occupiedTables.toString(),
        note: "Estado del salón en tiempo real",
      },
      {
        label: "Productos",
        value: overview.totalProducts.toString(),
        note: "Carta cargada en el sistema",
      },
    ];
  }, [overview]);

  const loadDashboard = async (currentToken: string) => {
    const [nextOverview, nextAnalytics, nextOrders] = await Promise.all([
      getOverview(currentToken),
      getAnalytics(currentToken),
      getActiveOrders(currentToken),
    ]);

    setOverview(nextOverview);
    setWeeklyRevenue(nextAnalytics.weeklyRevenue);
    setMonthlyRevenue(nextAnalytics.monthlyRevenue);
    setTopProducts(nextAnalytics.topProducts);
    setActiveOrders(nextOrders);
  };

  useEffect(() => {
    const saved = storedSession();
    if (saved) {
      setSession(saved);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      try {
        await loadDashboard(token);
        setError(null);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el panel");
        }
      }
    };

    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [token]);

  const handleLogin = async (username: string, password: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const nextSession = await login(username, password);
      localStorage.setItem("cashier_session", JSON.stringify(nextSession));
      setSession(nextSession);
      await loadDashboard(nextSession.token);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cashier_session");
    setSession(null);
    setOverview(null);
    setWeeklyRevenue([]);
    setMonthlyRevenue([]);
    setTopProducts([]);
    setActiveOrders([]);
    setPaymentTarget(null);
  };

  const handleCharge = (order: ActiveOrder) => {
    setPaymentTarget(order);
    setPaymentMethod("CASH");
  };

  const confirmPayment = async () => {
    if (!paymentTarget) return;

    setSubmitting(true);
    try {
      await processPayment(token, {
        orderId: paymentTarget.id,
        method: paymentMethod,
      });
      setPaymentTarget(null);
      await loadDashboard(token);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo procesar el pago");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="surface hero">
          <div className="eyebrow">Zar´fPizzas Caja</div>
          <h1 className="title">Cargando panel</h1>
          <p className="subtitle">Preparando la sesión y sincronizando el estado del salón.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app-shell">
        <AuthCard loading={submitting} onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />
        {error ? <div className="error" style={{ marginTop: 16 }}>{error}</div> : null}
      </div>
    );
  }

  const currentRevenue = tab === "weekly" ? weeklyRevenue : monthlyRevenue;

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <h1>Zar´fPizzas Caja</h1>
            <p>{session.user.username} · {session.user.role}</p>
          </div>
        </div>
        <div className="toolbar">
          <div className="pill">
            API: {API_BASE_URL}
          </div>
          <button className="btn btn-ghost" onClick={() => void loadDashboard(token)}>
            Refrescar
          </button>
          <button className="btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <section className="surface hero">
        <div className="eyebrow">Caja y control</div>
        <h1 className="title">Ingresos, órdenes y cobros en un solo lugar</h1>
        <p className="subtitle">
          Este panel es exclusivo para caja. Aquí se visualizan los ingresos semanales y mensuales, los pedidos activos y los cobros pendientes.
        </p>
      </section>

      {error ? <div className="error" style={{ marginTop: 16 }}>{error}</div> : null}

      <div className="grid metrics" style={{ marginTop: 16 }}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            note={metric.note}
          />
        ))}
      </div>

      <section className="toolbar" style={{ marginTop: 16, justifyContent: "space-between" }}>
        <div className="toolbar">
          <button className={`btn ${tab === "weekly" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("weekly")}>
            Semana
          </button>
          <button className={`btn ${tab === "monthly" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("monthly")}>
            Mes
          </button>
        </div>
        <div className="pill">
          Visualización de ingresos exclusiva para caja
        </div>
      </section>

      <div className="grid dashboard" style={{ marginTop: 16 }}>
        <RevenueChart
          title={tab === "weekly" ? "Ingresos semanales" : "Ingresos mensuales"}
          points={currentRevenue}
        />

        <section className="surface panel">
          <h2>Top productos</h2>
          <div className="list">
            {topProducts.length === 0 ? (
              <div style={{ color: "var(--muted)" }}>Todavía no hay ventas registradas.</div>
            ) : null}
            {topProducts.map((product, index) => (
              <div className="list-item" key={product.name}>
                <div>
                  <div style={{ fontWeight: 700 }}>{index + 1}. {product.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Unidades vendidas</div>
                </div>
                <div className="pill pill-success">{product.quantity ?? 0}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ marginTop: 16 }}>
        <OrdersTable orders={activeOrders} onCharge={handleCharge} />
      </div>

      {paymentTarget ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="surface modal">
            <div className="eyebrow">Cobro</div>
            <h2 style={{ margin: "8px 0 0" }}>Mesa {paymentTarget.table.number}</h2>
            <p className="subtitle" style={{ marginTop: 10 }}>
              Confirmá el método de pago para cerrar el pedido.
            </p>

            <div className="grid" style={{ marginTop: 16 }}>
              <label className="field">
                <span className="label">Método</span>
                <select className="select" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)}>
                  <option value="CASH">Efectivo</option>
                  <option value="DEBIT_CARD">Débito</option>
                  <option value="CREDIT_CARD">Crédito</option>
                  <option value="TRANSFER">Transferencia</option>
                  <option value="QR">QR</option>
                </select>
              </label>

              <div className="list-item">
                <div>
                  <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Total a cobrar</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>Gs {paymentTarget.totalAmount.toLocaleString("es-PY")}</div>
                </div>
                <div className="pill pill-warning">{paymentTarget.status}</div>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-ghost" onClick={() => setPaymentTarget(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={() => void confirmPayment()} disabled={submitting}>
                {submitting ? "Procesando..." : "Confirmar cobro"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
