'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface FooterProps {
  lastUpdate?: string | null;
}

export function Footer({ lastUpdate }: FooterProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <footer className="mt-12 py-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-h-text-muted">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="text-[11px] font-medium">
          Última atualização: <span className="text-h-text-dark font-bold">
            {lastUpdate ? formatDate(lastUpdate) : '---'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs italic opacity-60">Enjoy responsibly</span>
        <div className="h-4 w-[1px] bg-gray-300"></div>
        <Star className="h-4 w-4 text-h-dark-green opacity-40" />
      </div>
    </footer>
  );
}
