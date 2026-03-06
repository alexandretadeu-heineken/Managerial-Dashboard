'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DateFilter } from '@/components/DateFilter';
import { MetricCard } from '@/components/MetricCard';
import { TrendCard } from '@/components/TrendCard';
import { Footer } from '@/components/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import { Download, RefreshCw, Network, BarChart3, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthState = 'login' | 'forgot-password' | 'change-password' | 'authenticated';

export default function DashboardPage() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [user, setUser] = useState({ name: '', email: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
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

  const handleLogout = () => {
    setUser({ name: '', email: '' });
    setAuthState('login');
  };
  const handleForgotPassword = () => setAuthState('forgot-password');
  const handleChangePassword = () => setAuthState('change-password');
  const handleBackToLogin = () => setAuthState('login');

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
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="w-full lg:w-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-h-text-dark tracking-tight">Análise de Performance de Processos</h2>
              <p className="text-h-text-muted text-sm mt-1">Monitoramento de JOBs Managerial</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
              {/* Functional Date Filter */}
              <DateFilter onDateChange={(start, end) => console.log('Date changed:', start, end)} />

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
          {/* Column 1: Cross Allocation - Tax Incentives */}
          <div className="space-y-6">
            <MetricCard 
              title="Cross Allocation"
              subtitle="Tax Incentives e ATL/BTL"
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
              gradientId="gradient-green-1"
              calcValue="02h 10m"
              postValue="02h 15m"
            />
          </div>

          {/* Column 2: Cross Allocation - PL30 e EIA */}
          <div className="space-y-6">
            <MetricCard 
              title="Cross Allocation"
              subtitle="PL30 e EIA"
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
              gradientId="gradient-green-2"
              calcValue="02h 10m"
              postValue="02h 15m"
            />
          </div>

          {/* Column 3: TDD */}
          <div className="space-y-6">
            <MetricCard 
              title="TDD"
              subtitle="TDD"
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

          {/* Column 4: Eliminação */}
          <div className="space-y-6">
            <MetricCard 
              title="Eliminação"
              subtitle="Eliminação"
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
              gradientId="gradient-green-3"
              calcValue="01h 50m"
              postValue="00h 55m"
            />
          </div>
        </div>

        <Footer />
        </main>
      </div>
    </div>
  );
}
