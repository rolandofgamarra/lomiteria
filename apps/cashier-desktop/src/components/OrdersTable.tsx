import React from "react";
import type { ActiveOrder } from "../types";

type OrdersTableProps = {
  orders: ActiveOrder[];
  onCharge: (order: ActiveOrder) => void;
};

function statusClassName(status: string) {
  switch (status) {
    case "PENDING":
      return "pill pill-warning";
    case "PREPARING":
      return "pill";
    case "DELIVERED":
      return "pill pill-success";
    default:
      return "pill";
  }
}

export default function OrdersTable({ orders, onCharge }: OrdersTableProps) {
  return (
    <section className="surface panel">
      <h2>Pedidos activos</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Items</th>
              <th>Total</th>
              <th>Hora</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ color: "var(--muted)", padding: "24px 10px" }}>
                  No hay pedidos activos.
                </td>
              </tr>
            ) : null}
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>Mesa {order.table.number}</strong>
                </td>
                <td>
                  <span className={statusClassName(order.status)}>{order.status}</span>
                </td>
                <td>{order.items.length}</td>
                <td>Gs {order.totalAmount.toLocaleString("es-PY")}</td>
                <td>{new Date(order.createdAt).toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => onCharge(order)}>
                    Cobrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
