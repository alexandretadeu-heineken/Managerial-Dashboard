'use client';

import React from 'react';
import { Calculator, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendCardProps {
  title: string;
  chartColor: string;
  gradientId: string;
  calcValue: string;
  postValue: string;
  periods?: string[]; // Array of 3 periods, e.g., ['12/2025', '01/2026', '02/2026']
  timeLabels?: string[]; // Array of 3 time labels, e.g., ['1h 35m', '2h 15m', '2h 05m']
  values?: number[];  // Array of 3 values (seconds or hours)
}

export function TrendCard({
  title,
  chartColor,
  gradientId,
  calcValue,
  postValue,
  periods = ['M1', 'M2', 'M3'],
  timeLabels = [],
  values = [20, 15, 10]
}: TrendCardProps) {
  // Generate SVG path based on 3 values
  // viewBox is 0 0 100 40
  // x points: 0, 50, 100
  // y points: inverted values (max value maps to 5, min to 35)
  const maxVal = Math.max(...values, 1);
  const getY = (val: number) => 35 - ((val / maxVal) * 30);
  
  const p1 = { x: 0, y: getY(values[0] || 0) };
  const p2 = { x: 50, y: getY(values[1] || 0) };
  const p3 = { x: 100, y: getY(values[2] || 0) };
  
  const dynamicPath = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-card p-6 shadow-sm border border-gray-100 card-hover"
    >
      <p className="text-[11px] font-bold text-h-text-muted uppercase tracking-wider mb-6">{title}</p>
      <div className="h-32 w-full relative mb-8">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: chartColor, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: chartColor, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path
            className="line-chart-svg"
            d={dynamicPath}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
          />
          <path
            d={`${dynamicPath} V40 H0 Z`}
            fill={`url(#${gradientId})`}
            opacity="0.1"
          />
        </svg>
        <div className="flex justify-between mt-2 text-[8px] text-h-text-muted font-bold uppercase">
          {periods.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <span>{p}</span>
              {timeLabels[i] && <span className="mt-0.5">{timeLabels[i]}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        <div className="p-4 bg-h-gray-bg/50 rounded-lg border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-h-text-muted" />
            <span className="text-[10px] text-h-text-muted uppercase font-bold tracking-widest">Cálculo</span>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-h-text-dark">{calcValue}</p>
        </div>
        <div className="p-4 bg-h-gray-bg/50 rounded-lg border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="h-4 w-4 text-h-text-muted rotate-90" />
            <span className="text-[10px] text-h-text-muted uppercase font-bold tracking-widest">Postagem</span>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-h-text-dark">{postValue}</p>
        </div>
      </div>
    </motion.div>
  );
}
