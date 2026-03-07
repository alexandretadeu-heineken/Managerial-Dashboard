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
import { UsersView } from '@/components/UsersView';
import { Download, RefreshCw, Network, BarChart3, ArrowLeftRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { fetchLatestMetrics, ProcessMetric, groupMetricsByProcess, fetchLastUpdate } from '@/lib/metrics';

type AuthState = 'login' | 'forgot-password' | 'change-password' | 'authenticated';

export default function DashboardPage() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState({ name: '', email: '', role: 'user', id: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (activeTab === 'users' && user.id) {
      console.log('Sincronizando cargo para a aba de usuários...');
      const refreshRole = async () => {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) {
          console.log('Cargo no banco:', profile.role, 'Cargo local:', user.role);
          if (profile.role !== user.role) {
            console.log('Atualizando cargo local para:', profile.role);
            setUser(prev => ({ ...prev, role: profile.role || 'user' }));
          }
        }
      };
      refreshRole();
    }
  }, [activeTab, user.id, user.role]);

  const [isInitializing, setIsInitializing] = useState(true);
  const [metrics, setMetrics] = useState<Record<string, ProcessMetric[]>>({});
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const loadMetrics = async (period?: string) => {
    setIsLoadingMetrics(true);
    const [metricsData, updateTime] = await Promise.all([
      fetchLatestMetrics(period),
      fetchLastUpdate()
    ]);
    setMetrics(groupMetricsByProcess(metricsData));
    setLastUpdate(updateTime);
    setIsLoadingMetrics(false);
  };

  const handlePeriodChange = React.useCallback((period: string) => {
    setCurrentPeriod(period);
    loadMetrics(period);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMetrics(currentPeriod);
    setIsRefreshing(false);
  };

  const handleLogin = async (email: string, userId?: string) => {
    const namePart = email.split('@')[0];
    const name = namePart
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    
    let role = 'user';
    if (userId) {
      try {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
        if (profile) {
          role = profile.role || 'user';
        }
      } catch (e) {
        console.error('Erro ao buscar cargo:', e);
      }
      
      if (email === 'atacomp.heineken@gmail.com') {
        role = 'admin';
      }
    }
    
    setUser({ name, email, role, id: userId || '' });
    setAuthState('authenticated');
    setIsInitializing(false);
  };

  useEffect(() => {
    // Gerenciador único de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await handleLogin(session.user.email || '', session.user.id);
      } else if (event === 'SIGNED_OUT' || !session) {
        setAuthState('login');
        setUser({ name: '', email: '', role: 'user', id: '' });
        setIsInitializing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    console.log('Iniciando logout...');
    try {
      // Limpa o estado local IMEDIATAMENTE para dar feedback visual instantâneo
      setUser({ name: '', email: '', role: 'user', id: '' });
      setAuthState('login');
      setActiveTab('dashboard');
      
      // Tenta deslogar do servidor, mas não bloqueia a UI se falhar
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao deslogar do Supabase (servidor):', error);
      }
      
      console.log('Logout concluído com sucesso.');
    } catch (error) {
      console.error('Exceção durante o logout:', error);
      // Garante que o usuário volte para o login mesmo em caso de erro grave
      window.location.reload();
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
        if (variation <= 30) {
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

  const getCombinedMetricData = (calcCode: string, postCode: string) => {
    const calcData = metrics[calcCode] || [];
    const postData = metrics[postCode] || [];
    
    // Get all periods from both datasets to ensure alignment
    const allPeriods = Array.from(new Set([
      ...calcData.map(m => m.period),
      ...postData.map(m => m.period)
    ])).sort((a, b) => {
      // Sort periods descending (latest first) - this is a simple string sort for MM/YYYY
      // But we know they come from the database ordered by reference_date desc.
      // Let's find the reference date for each period to sort correctly.
      const refA = calcData.find(m => m.period === a)?.reference_date || postData.find(m => m.period === a)?.reference_date || '';
      const refB = calcData.find(m => m.period === b)?.reference_date || postData.find(m => m.period === b)?.reference_date || '';
      return refB.localeCompare(refA);
    });
    
    const combinedData = allPeriods.map(period => {
      const calc = calcData.find(m => m.period === period);
      const post = postData.find(m => m.period === period);
      return {
        period,
        processing_time_seconds: (calc?.processing_time_seconds || 0) + (post?.processing_time_seconds || 0)
      };
    });

    const latest = combinedData[0];
    const previous = combinedData[1];
    
    // Average of the periods shown in the chart (last 3)
    const chartData = combinedData.slice(0, 3);
    const totalSeconds = chartData.reduce((acc, m) => acc + m.processing_time_seconds, 0);
    const avgSeconds = chartData.length > 0 ? totalSeconds / chartData.length : 0;
    const avgH = Math.floor(avgSeconds / 3600);
    const avgM = Math.floor((avgSeconds % 3600) / 60);
    
    // Real Time (Latest)
    const realSeconds = latest?.processing_time_seconds || 0;
    const realH = Math.floor(realSeconds / 3600);
    const realM = Math.floor((realSeconds % 3600) / 60);

    // Trend
    let trendType: 'up' | 'down' | 'neutral' = 'neutral';
    let status = 'ESTÁVEL';
    let statusColor = 'bg-gray-100 text-h-text-muted';
    let chartColor = '#008248';
    let trendPercent = '0%';
    
    if (latest && previous && previous.processing_time_seconds > 0) {
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
        if (variation <= 30) {
          status = 'ALERTA';
          statusColor = 'bg-orange-100 text-orange-600';
          chartColor = '#EA580C';
        } else {
          status = 'CRÍTICO';
          statusColor = 'bg-h-red/10 text-h-red';
          chartColor = '#FF2B2B';
        }
      }
    }
    
    return {
      avgH: avgH.toString().padStart(2, '0'),
      avgM: avgM.toString().padStart(2, '0'),
      realH: realH.toString().padStart(2, '0'),
      realM: realM.toString().padStart(2, '0'),
      trendType,
      status,
      statusColor,
      chartColor,
      trendPercent,
      combinedData
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
        onItemClick={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onLogout={handleLogout} 
          onChangePassword={handleChangePassword} 
          userName={user.name}
          userEmail={user.email}
        />
        
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 md:px-10 py-8 overflow-y-auto">
          {activeTab === 'dashboard' ? (
            <>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {/* Column 1: Cross Allocation - Tax Incentives (CA001/CA002) */}
                <div className="space-y-6">
                  <MetricCard 
                    title="Cross Allocation"
                    subtitle="Tax Incentives e ATL/BTL"
                    icon={Network}
                    realTimeValue={getCombinedMetricData('CA001', 'CA002').realH}
                    realTimeUnit1="h"
                    realTimeValue2={getCombinedMetricData('CA001', 'CA002').realM}
                    realTimeUnit2="m"
                    value={getCombinedMetricData('CA001', 'CA002').avgH}
                    unit1="h"
                    value2={getCombinedMetricData('CA001', 'CA002').avgM}
                    unit2="m"
                    trend={getCombinedMetricData('CA001', 'CA002').trendPercent}
                    trendType={getCombinedMetricData('CA001', 'CA002').trendType}
                    status={getCombinedMetricData('CA001', 'CA002').status}
                    statusColor={getCombinedMetricData('CA001', 'CA002').statusColor}
                    iconColor="text-h-green"
                  />
                  <TrendCard 
                    title="TEMPO DE PROCESSAMENTO (HORAS)"
                    chartColor={getCombinedMetricData('CA001', 'CA002').chartColor}
                    gradientId="gradient-green-1"
                    calcValue={metrics['CA001']?.[0] ? `${metrics['CA001'][0].processing_time_hours}h ${metrics['CA001'][0].processing_time_minutes}m` : "00h 00m"}
                    postValue={metrics['CA002']?.[0] ? `${metrics['CA002'][0].processing_time_hours}h ${metrics['CA002'][0].processing_time_minutes}m` : "00h 00m"}
                    periods={getCombinedMetricData('CA001', 'CA002').combinedData.slice(0, 3).reverse().map(m => m.period)}
                    timeLabels={getCombinedMetricData('CA001', 'CA002').combinedData.slice(0, 3).reverse().map(m => {
                      const h = Math.floor(m.processing_time_seconds / 3600);
                      const min = Math.floor((m.processing_time_seconds % 3600) / 60);
                      return `${h}h ${min}m`;
                    })}
                    values={getCombinedMetricData('CA001', 'CA002').combinedData.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
                  />
                </div>

                {/* Column 2: Cross Allocation - PL30 e EIA (CA003/CA004) */}
                <div className="space-y-6">
                  <MetricCard 
                    title="Cross Allocation"
                    subtitle="PL30 e EIA"
                    icon={Network}
                    realTimeValue={getCombinedMetricData('CA003', 'CA004').realH}
                    realTimeUnit1="h"
                    realTimeValue2={getCombinedMetricData('CA003', 'CA004').realM}
                    realTimeUnit2="m"
                    value={getCombinedMetricData('CA003', 'CA004').avgH}
                    unit1="h"
                    value2={getCombinedMetricData('CA003', 'CA004').avgM}
                    unit2="m"
                    trend={getCombinedMetricData('CA003', 'CA004').trendPercent}
                    trendType={getCombinedMetricData('CA003', 'CA004').trendType}
                    status={getCombinedMetricData('CA003', 'CA004').status}
                    statusColor={getCombinedMetricData('CA003', 'CA004').statusColor}
                    iconColor="text-h-green"
                  />
                  <TrendCard 
                    title="TEMPO DE PROCESSAMENTO (HORAS)"
                    chartColor={getCombinedMetricData('CA003', 'CA004').chartColor}
                    gradientId="gradient-green-2"
                    calcValue={metrics['CA003']?.[0] ? `${metrics['CA003'][0].processing_time_hours}h ${metrics['CA003'][0].processing_time_minutes}m` : "00h 00m"}
                    postValue={metrics['CA004']?.[0] ? `${metrics['CA004'][0].processing_time_hours}h ${metrics['CA004'][0].processing_time_minutes}m` : "00h 00m"}
                    periods={getCombinedMetricData('CA003', 'CA004').combinedData.slice(0, 3).reverse().map(m => m.period)}
                    timeLabels={getCombinedMetricData('CA003', 'CA004').combinedData.slice(0, 3).reverse().map(m => {
                      const h = Math.floor(m.processing_time_seconds / 3600);
                      const min = Math.floor((m.processing_time_seconds % 3600) / 60);
                      return `${h}h ${min}m`;
                    })}
                    values={getCombinedMetricData('CA003', 'CA004').combinedData.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
                  />
                </div>

                {/* Column 3: TDD (TDD01/TDD02) */}
                <div className="space-y-6">
                  <MetricCard 
                    title="TDD"
                    subtitle="TDD"
                    icon={BarChart3}
                    realTimeValue={getCombinedMetricData('TDD01', 'TDD02').realH}
                    realTimeUnit1="h"
                    realTimeValue2={getCombinedMetricData('TDD01', 'TDD02').realM}
                    realTimeUnit2="m"
                    value={getCombinedMetricData('TDD01', 'TDD02').avgH}
                    unit1="h"
                    value2={getCombinedMetricData('TDD01', 'TDD02').avgM}
                    unit2="m"
                    trend={getCombinedMetricData('TDD01', 'TDD02').trendPercent}
                    trendType={getCombinedMetricData('TDD01', 'TDD02').trendType}
                    status={getCombinedMetricData('TDD01', 'TDD02').status}
                    statusColor={getCombinedMetricData('TDD01', 'TDD02').statusColor}
                    iconColor="text-h-red"
                  />
                  <TrendCard 
                    title="TEMPO DE PROCESSAMENTO (HORAS)"
                    chartColor={getCombinedMetricData('TDD01', 'TDD02').chartColor}
                    gradientId="gradient-red"
                    calcValue={metrics['TDD01']?.[0] ? `${metrics['TDD01'][0].processing_time_hours}h ${metrics['TDD01'][0].processing_time_minutes}m` : "00h 00m"}
                    postValue={metrics['TDD02']?.[0] ? `${metrics['TDD02'][0].processing_time_hours}h ${metrics['TDD02'][0].processing_time_minutes}m` : "00h 00m"}
                    periods={getCombinedMetricData('TDD01', 'TDD02').combinedData.slice(0, 3).reverse().map(m => m.period)}
                    timeLabels={getCombinedMetricData('TDD01', 'TDD02').combinedData.slice(0, 3).reverse().map(m => {
                      const h = Math.floor(m.processing_time_seconds / 3600);
                      const min = Math.floor((m.processing_time_seconds % 3600) / 60);
                      return `${h}h ${min}m`;
                    })}
                    values={getCombinedMetricData('TDD01', 'TDD02').combinedData.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
                  />
                </div>

                {/* Column 4: Eliminação (EL001/EL002) */}
                <div className="space-y-6">
                  <MetricCard 
                    title="Eliminação"
                    subtitle="Eliminação"
                    icon={ArrowLeftRight}
                    realTimeValue={getCombinedMetricData('EL001', 'EL002').realH}
                    realTimeUnit1="h"
                    realTimeValue2={getCombinedMetricData('EL001', 'EL002').realM}
                    realTimeUnit2="m"
                    value={getCombinedMetricData('EL001', 'EL002').avgH}
                    unit1="h"
                    value2={getCombinedMetricData('EL001', 'EL002').avgM}
                    unit2="m"
                    trend={getCombinedMetricData('EL001', 'EL002').trendPercent}
                    trendType={getCombinedMetricData('EL001', 'EL002').trendType}
                    status={getCombinedMetricData('EL001', 'EL002').status}
                    statusColor={getCombinedMetricData('EL001', 'EL002').statusColor}
                    iconColor="text-h-green"
                  />
                  <TrendCard 
                    title="TEMPO DE PROCESSAMENTO (HORAS)"
                    chartColor={getCombinedMetricData('EL001', 'EL002').chartColor}
                    gradientId="gradient-green-3"
                    calcValue={metrics['EL001']?.[0] ? `${metrics['EL001'][0].processing_time_hours}h ${metrics['EL001'][0].processing_time_minutes}m` : "00h 00m"}
                    postValue={metrics['EL002']?.[0] ? `${metrics['EL002'][0].processing_time_hours}h ${metrics['EL002'][0].processing_time_minutes}m` : "00h 00m"}
                    periods={getCombinedMetricData('EL001', 'EL002').combinedData.slice(0, 3).reverse().map(m => m.period)}
                    timeLabels={getCombinedMetricData('EL001', 'EL002').combinedData.slice(0, 3).reverse().map(m => {
                      const h = Math.floor(m.processing_time_seconds / 3600);
                      const min = Math.floor((m.processing_time_seconds % 3600) / 60);
                      return `${h}h ${min}m`;
                    })}
                    values={getCombinedMetricData('EL001', 'EL002').combinedData.slice(0, 3).reverse().map(m => m.processing_time_seconds / 3600)}
                  />
                </div>
              </div>
            </>
          ) : (
            <UsersView currentUserRole={user.role} />
          )}

          <Footer lastUpdate={lastUpdate} />
        </main>
      </div>
    </div>
  );
}
