'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SinglePeriodFilter } from '@/components/SinglePeriodFilter';
import { MetricCard } from '@/components/MetricCard';
import { TrendCard } from '@/components/TrendCard';
import { Footer } from '@/components/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { Download, RefreshCw, Network, BarChart3, ArrowLeftRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { fetchLatestMetrics, ProcessMetric, groupMetricsByProcess } from '@/lib/metrics';

type AuthState = 'login' | 'forgot-password' | 'change-password' | 'authenticated';

export default function DashboardPage() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState({ name: '', email: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, ProcessMetric[]>>({});
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<string>('');

  const loadMetrics = async (period?: string) => {
    setIsLoadingMetrics(true);
    const data = await fetchLatestMetrics(period);
    setMetrics(groupMetricsByProcess(data));
    setIsLoadingMetrics(false);
  };

  const handlePeriodChange = React.useCallback((period: string) => {
    setCurrentPeriod(period);
    loadMetrics(period);
  }, []);

  useEffect(() => {
    if (authState === 'authenticated') {
      // loadMetrics is now called by handlePeriodChange on mount
    }
  }, [authState]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          handleLogin(session.user.email || '');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleLogin(session.user.email || '');
      } else {
        setAuthState('login');
        setUser({ name: '', email: '' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMetrics(currentPeriod);
    setIsRefreshing(false);
  };

  const handleLogin = (email: string) => {
    // Extract name from email (e.g., "john.doe@heineken.com" -> "John Doe")
    const namePart = email.split('@')[0];
    const name = namePart
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    
    setUser({ name, email });
    setAuthState('authenticated');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser({ name: '', email: '' });
      setAuthState('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const handleForgotPassword = () => setAuthState('forgot-password');
  const handleChangePassword = () => setAuthState('change-password');
  const handleBackToLogin = () => setAuthState('login');

  const getMetricData = (code: string) => {
    const data = metrics[code] || [];
    const latest = data[0];
    const previous = data[1];
    
    // Average
    const totalSeconds = data.reduce((acc, m) => acc + m.processing_time_seconds, 0);
    const avgSeconds = data.length > 0 ? totalSeconds / data.length : 0;
    const avgH = Math.floor(avgSeconds / 3600);
    const avgM = Math.floor((avgSeconds % 3600) / 60);
    
    // Trend
    let trendType: 'up' | 'down' | 'neutral' = 'neutral';
    let status = 'ESTÁVEL';
    let statusColor = 'bg-gray-100 text-h-text-muted';
    let chartColor = '#008248'; // Default Green for ESTÁVEL
    let trendPercent = '0%';
    
    if (latest && previous) {
      const diff = latest.processing_time_seconds - previous.processing_time_seconds;
      const variation = (diff / previous.processing_time_seconds) * 100;
      trendPercent = `${Math.abs(Math.round(variation))}%`;

      if (latest.processing_time_seconds < previous.processing_time_seconds) {
        trendType = 'down';
        status = 'OTIMIZADO';
        statusColor = 'bg-h-green/10 text-h-green';
        chartColor = '#008248';
      } else if (latest.processing_time_seconds > previous.processing_time_seconds) {
        trendType = 'up';
        if (variation <= 10) {
          status = 'ALERTA';
          statusColor = 'bg-orange-100 text-orange-600';
          chartColor = '#EA580C';
        } else {
          status = 'CRÍTICO';
          statusColor = 'bg-h-red/10 text-h-red';
          chartColor = '#FF2B2B';
        }
      } else {
        trendType = 'neutral';
        status = 'ESTÁVEL';
        statusColor = 'bg-gray-100 text-h-text-muted';
        chartColor = '#008248';
      }
    }
    
    return {
      avgH: avgH.toString().padStart(2, '0'),
      avgM: avgM.toString().padStart(2, '0'),
      realH: latest?.processing_time_hours?.toString().padStart(2, '0') || "00",
      realM: latest?.processing_time_minutes?.toString().padStart(2, '0') || "00",
      trendType,
      status,
      statusColor,
      chartColor,
      trendPercent
    };
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-h-gray-bg">
        <Loader2 className="h-8 w-8 text-h-green animate-spin" />
      </div>
    );
  }

  if (authState !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-h-gray-bg">
        <AnimatePresence mode="wait">
          {authState === 'login' && (
            <LoginForm 
              key="login" 
              onLogin={handleLogin} 
              onForgotPassword={handleForgotPassword} 
            />
          )}
          {authState === 'forgot-password' && (
            <ForgotPasswordForm 
              key="forgot" 
              onBack={handleBackToLogin} 
            />
          )}
          {authState === 'change-password' && (
            <ChangePasswordForm 
              key="change" 
              onBack={handleBackToLogin}
              onSuccess={handleBackToLogin} 
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-h-gray-bg">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activeItem={activeTab}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onLogout={handleLogout} 
          onChangePassword={handleChangePassword} 
          userName={user.name}
          userEmail={user.email}
        />
        
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 py-8 overflow-y-auto">
          {Object.keys(metrics).length === 0 && !isLoadingMetrics && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-800 text-sm">
              <AlertCircle className="h-5 w-5" />
              <p>
                Nenhum dado encontrado no banco de dados. 
                Certifique-se de executar as migrations no Supabase para visualizar os indicadores reais.
              </p>
            </div>
          )}

          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="w-full lg:w-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-h-text-dark tracking-tight">Análise de Performance de Processos</h2>
              <p className="text-h-text-muted text-sm mt-1">Monitoramento de JOBs Managerial</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
              {/* Single Period Filter */}
              <SinglePeriodFilter onPeriodChange={handlePeriodChange} />

              <button 
                onClick={handleRefresh}
                className="w-full sm:w-auto bg-h-green text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-h-dark-green transition-all shadow-lg shadow-h-green/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                ATUALIZAR DADOS
              </button>

              <button className="w-full sm:w-auto bg-white px-5 py-2.5 rounded-full text-xs font-bold border border-gray-200 text-h-text-dark flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="h-4 w-4" />
                EXPORTAR RELATÓRIO
              </button>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Column 1: Cross Allocation - Tax Incentives (CA001/CA002) */}
          <div className="space-y-6">
            <MetricCard 
              title="Cross Allocation"
              subtitle="Tax Incentives e ATL/BTL"
              icon={Network}
              realTimeValue={getMetricData('CA002').realH}
              realTimeUnit1="h"
              realTimeValue2={getMetricData('CA002').realM}
              realTimeUnit2="m"
              value={getMetricData('CA002').avgH}
              unit1="h"
              value2={getMetricData('CA002').avgM}
              unit2="m"
              trend={getMetricData('CA002').trendPercent}
              trendType={getMetricData('CA002').trendType}
              status={getMetricData('CA002').status}
              statusColor={getMetricData('CA002').statusColor}
              iconColor="text-h-green"
            />
            <TrendCard 
              title="TEMPO DE PROCESSAMENTO (HORAS)"
              chartColor={getMetricData('CA002').chartColor}
              gradientId="gradient-green-1"
              calcValue={metrics['CA001']?.[0] ? `${metrics['CA001'][0].processing_time_hours}h ${metrics['CA001'][0].processing_time_minutes}m` : "00h 00m"}
              postValue={metrics['CA002']?.[0] ? `${metrics['CA002'][0].processing_time_hours}h ${metrics['CA002'][0].processing_time_minutes}m` : "00h 00m"}
              periods={metrics['CA002']?.slice(0, 3).reverse().map(m => m.period)}
              values={metrics['CA002']?.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
            />
          </div>

          {/* Column 2: Cross Allocation - PL30 e EIA (CA003/CA004) */}
          <div className="space-y-6">
            <MetricCard 
              title="Cross Allocation"
              subtitle="PL30 e EIA"
              icon={Network}
              realTimeValue={getMetricData('CA004').realH}
              realTimeUnit1="h"
              realTimeValue2={getMetricData('CA004').realM}
              realTimeUnit2="m"
              value={getMetricData('CA004').avgH}
              unit1="h"
              value2={getMetricData('CA004').avgM}
              unit2="m"
              trend={getMetricData('CA004').trendPercent}
              trendType={getMetricData('CA004').trendType}
              status={getMetricData('CA004').status}
              statusColor={getMetricData('CA004').statusColor}
              iconColor="text-h-green"
            />
            <TrendCard 
              title="TEMPO DE PROCESSAMENTO (HORAS)"
              chartColor={getMetricData('CA004').chartColor}
              gradientId="gradient-green-2"
              calcValue={metrics['CA003']?.[0] ? `${metrics['CA003'][0].processing_time_hours}h ${metrics['CA003'][0].processing_time_minutes}m` : "00h 00m"}
              postValue={metrics['CA004']?.[0] ? `${metrics['CA004'][0].processing_time_hours}h ${metrics['CA004'][0].processing_time_minutes}m` : "00h 00m"}
              periods={metrics['CA004']?.slice(0, 3).reverse().map(m => m.period)}
              values={metrics['CA004']?.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
            />
          </div>

          {/* Column 3: TDD (TDD01/TDD02) */}
          <div className="space-y-6">
            <MetricCard 
              title="TDD"
              subtitle="TDD"
              icon={BarChart3}
              realTimeValue={getMetricData('TDD02').realH}
              realTimeUnit1="h"
              realTimeValue2={getMetricData('TDD02').realM}
              realTimeUnit2="m"
              value={getMetricData('TDD02').avgH}
              unit1="h"
              value2={getMetricData('TDD02').avgM}
              unit2="m"
              trend={getMetricData('TDD02').trendPercent}
              trendType={getMetricData('TDD02').trendType}
              status={getMetricData('TDD02').status}
              statusColor={getMetricData('TDD02').statusColor}
              iconColor="text-h-red"
            />
            <TrendCard 
              title="TEMPO DE PROCESSAMENTO (HORAS)"
              chartColor={getMetricData('TDD02').chartColor}
              gradientId="gradient-red"
              calcValue={metrics['TDD01']?.[0] ? `${metrics['TDD01'][0].processing_time_hours}h ${metrics['TDD01'][0].processing_time_minutes}m` : "00h 00m"}
              postValue={metrics['TDD02']?.[0] ? `${metrics['TDD02'][0].processing_time_hours}h ${metrics['TDD02'][0].processing_time_minutes}m` : "00h 00m"}
              periods={metrics['TDD02']?.slice(0, 3).reverse().map(m => m.period)}
              values={metrics['TDD02']?.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
            />
          </div>

          {/* Column 4: Eliminação (EL001/EL002) */}
          <div className="space-y-6">
            <MetricCard 
              title="Eliminação"
              subtitle="Eliminação"
              icon={ArrowLeftRight}
              realTimeValue={getMetricData('EL002').realH}
              realTimeUnit1="h"
              realTimeValue2={getMetricData('EL002').realM}
              realTimeUnit2="m"
              value={getMetricData('EL002').avgH}
              unit1="h"
              value2={getMetricData('EL002').avgM}
              unit2="m"
              trend={getMetricData('EL002').trendPercent}
              trendType={getMetricData('EL002').trendType}
              status={getMetricData('EL002').status}
              statusColor={getMetricData('EL002').statusColor}
              iconColor="text-h-green"
            />
            <TrendCard 
              title="TEMPO DE PROCESSAMENTO (HORAS)"
              chartColor={getMetricData('EL002').chartColor}
              gradientId="gradient-green-3"
              calcValue={metrics['EL001']?.[0] ? `${metrics['EL001'][0].processing_time_hours}h ${metrics['EL001'][0].processing_time_minutes}m` : "00h 00m"}
              postValue={metrics['EL002']?.[0] ? `${metrics['EL002'][0].processing_time_hours}h ${metrics['EL002'][0].processing_time_minutes}m` : "00h 00m"}
              periods={metrics['EL002']?.slice(0, 3).reverse().map(m => m.period)}
              values={metrics['EL002']?.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
            />
          </div>
        </div>

        <Footer />
        </main>
      </div>
    </div>
  );
}
