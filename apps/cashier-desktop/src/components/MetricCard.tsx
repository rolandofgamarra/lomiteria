import React from "react";

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <article className="surface metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </article>
  );
}
