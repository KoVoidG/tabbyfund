"use client";

import { TrendingUp } from "lucide-react";

interface DataPoint {
  month: string;
  [key: string]: string | number;
}

interface AnalyticsCardProps {
  title: string;
  data: DataPoint[];
  valueKey: string;
  formatType?: "currency" | "percent" | "number" | "count";
  color?: string;
}

/**
 * AnalyticsCard — simple bar chart card for admin analytics.
 * Uses CSS bars rather than Recharts for lightweight demo.
 */
export function AnalyticsCard({ title, data, valueKey, formatType = "number", color = "#6C5CE7" }: AnalyticsCardProps) {
  const values = data.map((d) => d[valueKey] as number);
  const max = Math.max(...values, 1);
  const total = values.reduce((s, v) => s + v, 0);

  function formatValue(val: number): string {
    switch (formatType) {
      case "currency":
        return `฿${(val / 1000).toFixed(0)}k`;
      case "percent":
        return `${val}%`;
      case "count":
        return `${val} total`;
      default:
        return val.toLocaleString();
    }
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#2D3748]">{title}</h3>
        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
          <TrendingUp size={12} strokeWidth={1.5} /> {formatValue(total)}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-28">
        {data.map((d, i) => {
          const val = Number(d[valueKey] ?? 0);
          const height = (val / max) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[4px] transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: 0.15 + (i / data.length) * 0.85,
                  }}
                />
              </div>
              <span className="text-[8px] text-[#2D3748]/40">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
