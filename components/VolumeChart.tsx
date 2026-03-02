'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, HistogramData } from 'lightweight-charts';
import { Fill } from '@/types';

interface VolumeChartProps {
  fills: Fill[];
  isLoading?: boolean;
}

export function VolumeChart({ fills, isLoading }: VolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || !fills || fills.length === 0) return;

    const isDark = document.documentElement.classList.contains('dark');
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#8b949e' : '#57606a',
      },
      grid: {
        vertLines: { color: isDark ? '#30363d' : '#d0d7de' },
        horzLines: { color: isDark ? '#30363d' : '#d0d7de' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 200,
      rightPriceScale: {
        borderColor: isDark ? '#30363d' : '#d0d7de',
      },
      timeScale: {
        borderColor: isDark ? '#30363d' : '#d0d7de',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Aggregate volume by day
    const volumeByDay: Record<string, { buy: number; sell: number }> = {};
    
    fills.forEach(fill => {
      const date = new Date(fill.time).toISOString().split('T')[0];
      const value = parseFloat(fill.px) * parseFloat(fill.sz);
      
      if (!volumeByDay[date]) {
        volumeByDay[date] = { buy: 0, sell: 0 };
      }
      
      if (fill.side === 'B') {
        volumeByDay[date].buy += value;
      } else {
        volumeByDay[date].sell += value;
      }
    });

    // Convert to chart data - already sorted by date string
    const sortedDays = Object.keys(volumeByDay).sort();
    const histogramData: HistogramData[] = sortedDays.map(day => {
      const vol = volumeByDay[day];
      const netVolume = vol.buy - vol.sell;
      return {
        time: day as any,
        value: Math.abs(netVolume),
        color: netVolume >= 0 ? '#3fb950' : '#f85149',
      };
    });

    if (histogramData.length > 0) {
      const histogramSeries = chart.addHistogramSeries({});
      histogramSeries.setData(histogramData);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [fills, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4"></div>
        <div className="skeleton h-[200px] rounded-lg"></div>
      </div>
    );
  }

  if (!fills || fills.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Tägliches Volumen (Netto)</h3>
      <div ref={chartContainerRef} className="w-full h-[200px]" />
    </div>
  );
}