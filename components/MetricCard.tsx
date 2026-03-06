'use client';

import React from 'react';
import { TrendingDown, TrendingUp, Minus, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  unit1: string;
  value2: string;
  unit2: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  status: string;
  statusColor: string;
  iconColor: string;
}

export function MetricCard({
  title,
  icon: Icon,
  value,
  unit1,
  value2,
  unit2,
  trend,
  trendType,
  status,
  statusColor,
  iconColor
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-card p-6 shadow-sm border border-gray-100 card-hover"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <h3 className="text-sm font-bold text-h-text-dark uppercase tracking-wider">{title}</h3>
        </div>
        <span className={`text-[10px] ${statusColor} font-bold px-2 py-0.5 rounded-full`}>
          {status}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-h-text-muted text-[11px] font-semibold uppercase tracking-tighter">Tempo Médio Semestral</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-light text-h-text-dark">
            {value}<span className="text-xl font-bold">{unit1}</span> {value2}<span className="text-xl font-bold">{unit2}</span>
          </span>
          <div className={`flex items-center text-xs font-bold ${
            trendType === 'down' ? 'text-h-green' : trendType === 'up' ? 'text-h-red' : 'text-h-text-muted'
          }`}>
            {trendType === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
            {trendType === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {trendType === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
            {trend}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
