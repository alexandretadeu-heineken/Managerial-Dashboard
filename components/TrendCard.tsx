'use client';

import React from 'react';
import { Calculator, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface TrendCardProps {
  title: string;
  chartPath: string;
  chartColor: string;
  gradientId: string;
  calcValue: string;
  postValue: string;
}

export function TrendCard({
  title,
  chartPath,
  chartColor,
  gradientId,
  calcValue,
  postValue
}: TrendCardProps) {
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
            d={chartPath}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
          />
          <path
            d={`${chartPath} V40 H0 Z`}
            fill={`url(#${gradientId})`}
            opacity="0.1"
          />
        </svg>
        <div className="flex justify-between mt-2 text-[9px] text-h-text-muted font-bold uppercase">
          <span>Jan</span><span>Mar</span><span>Jun</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-h-gray-bg/50 rounded-lg border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-h-text-muted" />
            <span className="text-[10px] text-h-text-muted uppercase font-bold tracking-widest">Cálculo</span>
          </div>
          <p className="text-xl font-semibold text-h-text-dark">{calcValue}</p>
        </div>
        <div className="p-4 bg-h-gray-bg/50 rounded-lg border border-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="h-4 w-4 text-h-text-muted rotate-90" />
            <span className="text-[10px] text-h-text-muted uppercase font-bold tracking-widest">Postagem</span>
          </div>
          <p className="text-xl font-semibold text-h-text-dark">{postValue}</p>
        </div>
      </div>
    </motion.div>
  );
}
