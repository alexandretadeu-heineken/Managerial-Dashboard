'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAvailablePeriods } from '@/lib/metrics';

interface SinglePeriodFilterProps {
  onPeriodChange: (period: string) => void;
}

export function SinglePeriodFilter({ onPeriodChange }: SinglePeriodFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPeriods = async () => {
      const availablePeriods = await fetchAvailablePeriods();
      setPeriods(availablePeriods);
      if (availablePeriods.length > 0) {
        // Default to the latest period
        const latest = availablePeriods[availablePeriods.length - 1];
        setSelectedPeriod(latest);
        onPeriodChange(latest);
      }
      setIsLoading(false);
    };
    loadPeriods();
  }, [onPeriodChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
    setIsOpen(false);
  };

  if (isLoading) return <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-full" />;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="h-4 w-4 text-h-text-muted" />
        <span className="text-xs font-bold text-h-text-dark uppercase tracking-tight">
          PERÍODO: {selectedPeriod || 'CARREGANDO...'}
        </span>
        <ChevronDown className={`h-4 w-4 text-h-text-muted opacity-40 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
          >
            <p className="text-[10px] font-bold text-h-text-muted uppercase tracking-widest mb-3 px-2">SELECIONE O PERÍODO</p>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {[...periods].reverse().map((p) => (
                <button
                  key={p}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedPeriod === p 
                      ? 'bg-h-green text-white font-bold shadow-md shadow-h-green/20' 
                      : 'hover:bg-h-gray-bg text-h-text-dark'
                  }`}
                >
                  {p}
                  {selectedPeriod === p && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
