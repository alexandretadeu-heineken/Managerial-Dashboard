'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subMonths, startOfMonth, endOfMonth, addYears, subYears, isSameMonth, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateFilterProps {
  onDateChange?: (start: Date, end: Date) => void;
}

export function DateFilter({ onDateChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default values: End = current - 1, Start = current - 3
  const [endDate, setEndDate] = useState(() => startOfMonth(subMonths(new Date(), 1)));
  const [startDate, setStartDate] = useState(() => startOfMonth(subMonths(new Date(), 3)));
  
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(viewYear, monthIndex, 1);
    
    if (selecting === 'start') {
      if (isAfter(newDate, endDate)) {
        setStartDate(newDate);
        setEndDate(newDate);
        setSelecting('end');
      } else {
        setStartDate(newDate);
        setSelecting('end');
      }
    } else {
      if (isBefore(newDate, startDate)) {
        setStartDate(newDate);
        setEndDate(newDate);
      } else {
        setEndDate(newDate);
        setIsOpen(false);
        if (onDateChange) onDateChange(startDate, newDate);
      }
    }
  };

  const formattedRange = `${format(startDate, 'MMM yyyy', { locale: ptBR })} - ${format(endDate, 'MMM yyyy', { locale: ptBR })}`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="h-4 w-4 text-h-text-muted" />
        <span className="text-xs font-bold text-h-text-dark uppercase tracking-tight">
          {formattedRange}
        </span>
        <ChevronDown className={`h-4 w-4 text-h-text-muted opacity-40 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setViewYear(viewYear - 1)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={18} className="text-h-text-muted" />
              </button>
              <span className="font-bold text-h-text-dark">{viewYear}</span>
              <button 
                onClick={() => setViewYear(viewYear + 1)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={18} className="text-h-text-muted" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelecting('start')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  selecting === 'start' ? 'bg-h-green text-white' : 'bg-h-gray-bg text-h-text-muted'
                }`}
              >
                MÊS INICIAL
              </button>
              <button
                onClick={() => setSelecting('end')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  selecting === 'end' ? 'bg-h-green text-white' : 'bg-h-gray-bg text-h-text-muted'
                }`}
              >
                MÊS FINAL
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const currentMonthDate = new Date(viewYear, index, 1);
                const isStart = isSameMonth(currentMonthDate, startDate);
                const isEnd = isSameMonth(currentMonthDate, endDate);
                const isInRange = isAfter(currentMonthDate, startDate) && isBefore(currentMonthDate, endDate);

                return (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(index)}
                    className={`py-3 text-xs font-medium rounded-xl transition-all ${
                      isStart || isEnd 
                        ? 'bg-h-green text-white font-bold shadow-md shadow-h-green/20' 
                        : isInRange
                        ? 'bg-h-green/10 text-h-green font-bold'
                        : 'hover:bg-h-gray-bg text-h-text-dark'
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] text-h-text-muted font-medium">
                {selecting === 'start' ? 'Selecione o início' : 'Selecione o fim'}
              </p>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-bold text-h-green hover:underline"
              >
                FECHAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
