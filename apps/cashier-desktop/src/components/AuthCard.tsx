import React, { useState } from "react";

type AuthCardProps = {
  loading: boolean;
  onLogin: (username: string, password: string) => void;
  apiBaseUrl: string;
};

export default function AuthCard({ loading, onLogin, apiBaseUrl }: AuthCardProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-wrap">
      <div className="surface auth-card">
        <div className="auth-visual">
          <div>
            <div className="eyebrow">Caja y control</div>
            <h1 className="title">Zar´fPizzas</h1>
            <p className="subtitle" style={{ marginTop: 14, color: "var(--text)" }}>
              Panel de caja para ver ingresos semanales y mensuales, pedidos activos y cierre de pagos.
            </p>
            <div className="pill" style={{ marginTop: 16 }}>
              API detectada: {apiBaseUrl}
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <div className="surface metric" style={{ background: "rgba(255,249,241,0.85)" }}>
              <div className="metric-label">Acceso</div>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>CASHIER</div>
              <div className="metric-note">Solo para caja y administración</div>
            </div>
            <div className="surface metric" style={{ background: "rgba(255,249,241,0.85)" }}>
              <div className="metric-label">Demo</div>
              <div className="metric-value" style={{ fontSize: "1.5rem" }}>cashier1</div>
              <div className="metric-note">Clave: zarf123</div>
            </div>
          </div>
        </div>

        <div className="auth-form">
          <div className="eyebrow">Ingreso seguro</div>
          <h2 style={{ margin: "8px 0 0" }}>Iniciar sesión</h2>
          <p className="subtitle" style={{ marginTop: 10, color: "var(--text)" }}>
            Accedé con un usuario de caja para ver métricas de ingresos y gestionar pagos.
          </p>

          <form
            className="form"
            style={{ marginTop: 22 }}
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(username, password);
            }}
          >
            <label className="field">
              <span className="label">Usuario</span>
              <input
                className="input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="cashier1"
                autoComplete="username"
              />
            </label>

            <label className="field">
              <span className="label">Contraseña</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
