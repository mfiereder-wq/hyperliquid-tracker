"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  HistogramData,
} from "lightweight-charts";
import { Fill } from "@/types";
import { formatUSD } from "@/lib/api";

interface VolumeChartProps {
  fills: Fill[];
  isLoading?: boolean;
  detailed?: boolean;
}

export function VolumeChart({
  fills,
  isLoading,
  detailed = false,
}: VolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || !fills || fills.length === 0)
      return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#2a2d38" },
        horzLines: { color: "#2a2d38" },
      },
      width: chartContainerRef.current.clientWidth,
      height: detailed ? 300 : 200,
      rightPriceScale: {
        borderColor: "#2a2d38",
      },
      timeScale: {
        borderColor: "#2a2d38",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Aggregate volume by day
    const volumeByDay: Record<string, { buy: number; sell: number }> = {};

    fills.forEach((fill) => {
      const date = new Date(fill.time).toISOString().split("T")[0];
      const value = parseFloat(fill.px) * parseFloat(fill.sz);
      if (!volumeByDay[date]) {
        volumeByDay[date] = { buy: 0, sell: 0 };
      }
      if (fill.side === "B") {
        volumeByDay[date].buy += value;
      } else {
        volumeByDay[date].sell += value;
      }
    });

    // Convert to chart data - already sorted by date string
    const sortedDays = Object.keys(volumeByDay).sort();
    const histogramData: HistogramData[] = sortedDays.map((day) => {
      const vol = volumeByDay[day];
      const netVolume = vol.buy - vol.sell;
      return {
        time: day as any,
        value: Math.abs(netVolume),
        color: netVolume >= 0 ? "#10b981" : "#ef4444",
      };
    });

    if (histogramData.length > 0) {
      const histogramSeries = chart.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
      });
      histogramSeries.setData(histogramData);
    }

    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [fills, isLoading, detailed]);

  if (isLoading) {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4"></div>
        <div className="skeleton h-[200px] rounded-xl"></div>
      </div>
    );
  }

  if (!fills || fills.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-text">Volumen</h3>
          <p className="text-sm text-text-muted">Netto Volumen pro Tag</p>
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className={`w-full ${detailed ? "h-[300px]" : "h-[200px]"}`}
      />
    </div>
  );
}

export default VolumeChart;
