'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { TrendCard } from '@/components/TrendCard';
import { Footer } from '@/components/Footer';
import { Download, RefreshCw, Network, BarChart3, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-h-text-dark tracking-tight">Análise de Performance de Processos</h2>
            <p className="text-h-text-muted text-sm mt-1">Monitoramento executivo de SLAs e tendências operacionais.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white px-5 py-2.5 rounded-full text-xs font-bold border border-gray-200 text-h-text-dark flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="h-4 w-4" />
              EXPORTAR RELATÓRIO
            </button>
            <button 
              onClick={handleRefresh}
              className="flex-1 md:flex-none bg-h-green text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              ATUALIZAR DADOS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Cross Allocation */}
          <div className="space-y-6">
            <MetricCard 
              title="Cross Allocation"
              icon={Network}
              value="04"
              unit1="h"
              value2="25"
              unit2="m"
              trend="12%"
              trendType="down"
              status="OTIMIZADO"
              statusColor="bg-h-green/10 text-h-green"
              iconColor="text-h-green"
            />
            <TrendCard 
              title="Tendência Semestral (Horas)"
              chartPath="M0,35 Q15,25 30,28 T60,15 T100,10"
              chartColor="#008248"
              gradientId="gradient-green"
              calcValue="02h 10m"
              postValue="02h 15m"
            />
          </div>

          {/* Column 2: TDD */}
          <div className="space-y-6">
            <MetricCard 
              title="TDD"
              icon={BarChart3}
              value="06"
              unit1="h"
              value2="12"
              unit2="m"
              trend="08%"
              trendType="up"
              status="ALERTA"
              statusColor="bg-h-red/10 text-h-red"
              iconColor="text-h-red"
            />
            <TrendCard 
              title="Tendência Semestral (Horas)"
              chartPath="M0,30 Q20,32 40,25 T70,10 T100,2"
              chartColor="#FF2B2B"
              gradientId="gradient-red"
              calcValue="03h 45m"
              postValue="02h 27m"
            />
          </div>

          {/* Column 3: Eliminação */}
          <div className="space-y-6">
            <MetricCard 
              title="Eliminação"
              icon={ArrowLeftRight}
              value="02"
              unit1="h"
              value2="45"
              unit2="m"
              trend="0%"
              trendType="neutral"
              status="ESTÁVEL"
              statusColor="bg-gray-100 text-h-text-muted"
              iconColor="text-h-green"
            />
            <TrendCard 
              title="Tendência Semestral (Horas)"
              chartPath="M0,20 Q20,18 40,22 T70,20 T100,19"
              chartColor="#008248"
              gradientId="gradient-green-2"
              calcValue="01h 50m"
              postValue="00h 55m"
            />
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
