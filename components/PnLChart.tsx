'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, LineData, HistogramData } from 'lightweight-charts';
import { Fill } from '@/types';

interface PnLChartProps {
  fills: Fill[];
  isLoading?: boolean;
}

export function PnLChart({ fills, isLoading }: PnLChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [chartType, setChartType] = useState<'cumulative' | 'histogram'>('cumulative');

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
      height: 320,
      rightPriceScale: {
        borderColor: isDark ? '#30363d' : '#d0d7de',
      },
      timeScale: {
        borderColor: isDark ? '#30363d' : '#d0d7de',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDark ? '#58a6ff' : '#0969da',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDark ? '#58a6ff' : '#0969da',
          width: 1,
          style: 2,
        },
      },
    });

    chartRef.current = chart;

    // Sort fills by time
    const sortedFills = [...fills].sort((a, b) => a.time - b.time);

    if (chartType === 'cumulative') {
      // Cumulative PnL line chart (Equity Curve)
      let cumulativePnl = 0;
      const dataMap = new Map<number, number>();
      
      sortedFills
        .filter(f => f.closedPnl !== undefined)
        .forEach(f => {
          const time = Math.floor(f.time / 1000);
          cumulativePnl += parseFloat(f.closedPnl || '0');
          // Keep the last value for each timestamp
          dataMap.set(time, cumulativePnl);
        });

      // Convert to array and sort by time (ascending)
      const cumulativeData: LineData[] = Array.from(dataMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([time, value]) => ({
          time: time as any,
          value,
        }));

      if (cumulativeData.length > 0) {
        const lineSeries = chart.addLineSeries({
          color: '#58a6ff',
          lineWidth: 2,
        });
        lineSeries.setData(cumulativeData);
      }
    } else {
      // PnL histogram per trade - aggregate by timestamp
      const dataMap = new Map<number, { value: number; color: string }>();
      
      sortedFills
        .filter(f => f.closedPnl !== undefined)
        .forEach(f => {
          const time = Math.floor(f.time / 1000);
          const pnl = parseFloat(f.closedPnl || '0');
          
          if (dataMap.has(time)) {
            // Sum PnL for same timestamp
            const existing = dataMap.get(time)!;
            const newValue = existing.value + pnl;
            dataMap.set(time, {
              value: newValue,
              color: newValue >= 0 ? '#3fb950' : '#f85149',
            });
          } else {
            dataMap.set(time, {
              value: pnl,
              color: pnl >= 0 ? '#3fb950' : '#f85149',
            });
          }
        });

      // Convert to array and sort by time (ascending)
      const histogramData: HistogramData[] = Array.from(dataMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([time, data]) => ({
          time: time as any,
          value: data.value,
          color: data.color,
        }));

      if (histogramData.length > 0) {
        const histogramSeries = chart.addHistogramSeries({});
        histogramSeries.setData(histogramData);
      }
    }

    chart.timeScale().fitContent();

    // Handle resize
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
  }, [fills, isLoading, chartType]);

  if (isLoading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <div className="skeleton h-6 w-40 rounded mb-4"></div>
        <div className="skeleton h-[320px] rounded-lg"></div>
      </div>
    );
  }

  if (!fills || fills.length === 0) {
    return null;
  }

  const hasPnL = fills.some(f => f.closedPnl !== undefined && parseFloat(f.closedPnl) !== 0);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Equity Curve</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('cumulative')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              chartType === 'cumulative'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Kumulativ
          </button>
          <button
            onClick={() => setChartType('histogram')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              chartType === 'histogram'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            Pro Trade
          </button>
        </div>
      </div>
      {hasPnL ? (
        <div ref={chartContainerRef} className="w-full h-[320px]" />
      ) : (
        <div className="h-[320px] flex items-center justify-center text-[var(--muted)]">
          Keine geschlossenen Trades mit PnL-Daten
        </div>
      )}
    </div>
  );
}