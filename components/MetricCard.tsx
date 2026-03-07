'use client';

import React from 'react';
import { TrendingDown, TrendingUp, Minus, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  value: string;
  unit1: string;
  value2: string;
  unit2: string;
  realTimeValue?: string;
  realTimeUnit1?: string;
  realTimeValue2?: string;
  realTimeUnit2?: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  status: string;
  statusColor: string;
  iconColor: string;
}

export function MetricCard({
  title,
  subtitle,
  icon: Icon,
  value,
  unit1,
  value2,
  unit2,
  realTimeValue,
  realTimeUnit1,
  realTimeValue2,
  realTimeUnit2,
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
          <div>
            <h3 className="text-sm font-bold text-h-text-dark uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-[10px] text-h-text-muted font-medium mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-[10px] ${statusColor} font-bold px-2 py-0.5 rounded-full uppercase`}>
          {status}
        </span>
      </div>
      
      <div className="space-y-4">
        {realTimeValue && (
          <div className="space-y-1">
            <p className="text-h-text-muted text-[10px] font-bold uppercase tracking-widest">Tempo Real</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light text-h-text-dark">
                {realTimeValue}<span className="text-sm font-bold uppercase">{realTimeUnit1}</span> {realTimeValue2}<span className="text-sm font-bold uppercase">{realTimeUnit2}</span>
              </span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-h-text-muted text-[10px] font-bold uppercase tracking-widest">Tempo Médio</p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-light text-h-text-dark whitespace-nowrap">
              {value}<span className="text-sm font-bold uppercase">{unit1}</span> {value2}<span className="text-sm font-bold uppercase">{unit2}</span>
            </span>
            <div className={`flex items-center text-[10px] font-bold ${
              trendType === 'down' 
                ? 'text-h-green' 
                : trendType === 'up' 
                  ? (status === 'ALERTA' ? 'text-orange-600' : 'text-h-red') 
                  : 'text-h-text-muted'
            }`}>
              {trendType === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
              {trendType === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {trendType === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
              {trend}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
