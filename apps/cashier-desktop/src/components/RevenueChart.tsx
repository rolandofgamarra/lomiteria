import React from "react";
import type { RevenuePoint } from "../types";

type RevenueChartProps = {
  title: string;
  points: RevenuePoint[];
};

export default function RevenueChart({ title, points }: RevenueChartProps) {
  const max = Math.max(1, ...points.map((point) => point.amount));

  return (
    <section className="surface panel">
      <h2>{title}</h2>
      <div className="chart">
        {points.map((point) => {
          const width = `${Math.max(8, Math.round((point.amount / max) * 100))}%`;
          return (
            <div className="chart-row" key={point.label}>
              <div className="chart-label">{point.label}</div>
              <div className="bar-track" aria-hidden="true">
                <div className="bar-fill" style={{ width }} />
              </div>
              <div className="chart-value">Gs {point.amount.toLocaleString("es-PY")}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
