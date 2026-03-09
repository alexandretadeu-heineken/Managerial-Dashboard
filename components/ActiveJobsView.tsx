'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  RefreshCw, 
  Timer, 
  ArrowRight,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { fetchAverageProcessingTimes } from '@/lib/metrics';
import { format, addSeconds, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveJob {
  id: string;
  process_code: string;
  process_description: string;
  start_time: string;
  last_update: string;
  completion_time: string | null;
  status: 'in_progress' | 'finished';
  progress_percentage: number;
}

export function ActiveJobsView() {
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [averageTimes, setAverageTimes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [jobsResponse, averages] = await Promise.all([
        supabase
          .from('active_jobs')
          .select('*')
          .order('start_time', { ascending: false }),
        fetchAverageProcessingTimes()
      ]);

      if (jobsResponse.error) throw jobsResponse.error;
      
      setActiveJobs(jobsResponse.data || []);
      setAverageTimes(averages);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching active jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('active_jobs_changes')
      .on('postgres_changes', { event: '*', table: 'active_jobs', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const calculateEstimatedCompletion = (job: ActiveJob) => {
    if (job.status === 'finished' && job.completion_time) {
      return new Date(job.completion_time);
    }
    
    const avgSeconds = averageTimes[job.process_code] || 0;
    if (avgSeconds === 0) return null;
    
    return addSeconds(new Date(job.start_time), avgSeconds);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-blue-500';
    if (percentage < 70) return 'bg-amber-500';
    return 'bg-h-green';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-h-text-dark tracking-tight">Managerial JOBs em andamento</h2>
          <p className="text-h-text-muted text-sm mt-1">Monitoramento em tempo real dos processos ativos</p>
        </div>
        
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-h-text-dark hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Atualizar
        </button>
      </div>

      {isLoading && activeJobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : activeJobs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {activeJobs.map((job) => {
              const estimatedEnd = calculateEstimatedCompletion(job);
              const isFinished = job.status === 'finished';
              
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-h-green/20 transition-all duration-500 overflow-hidden group"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isFinished ? 'bg-h-green/10 text-h-green' : 'bg-blue-50 text-blue-600 animate-pulse'
                        }`}>
                          {isFinished ? <CheckCircle2 className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-h-green bg-h-green/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {job.process_code}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isFinished ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {isFinished ? 'Finalizado' : 'Em Andamento'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-h-text-dark mt-1 group-hover:text-h-green transition-colors">
                            {job.process_description}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Progress Section */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-h-text-dark">Evolução do Processamento</span>
                          <span className="text-2xl font-black text-h-text-dark">{Math.round(job.progress_percentage)}%</span>
                        </div>
                        <div className="h-3 bg-h-gray-bg rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${job.progress_percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${getProgressColor(job.progress_percentage)} shadow-lg shadow-current/20`}
                          />
                        </div>
                      </div>

                      {/* Timeline Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-h-gray-bg/50 rounded-2xl p-4 border border-gray-50">
                          <div className="flex items-center gap-2 text-h-text-muted mb-1">
                            <Play className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Início</span>
                          </div>
                          <p className="text-xs font-bold text-h-text-dark">
                            {format(new Date(job.start_time), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                          </p>
                        </div>
                        
                        <div className="bg-h-gray-bg/50 rounded-2xl p-4 border border-gray-50">
                          <div className="flex items-center gap-2 text-h-text-muted mb-1">
                            <RefreshCw className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Última Atualização</span>
                          </div>
                          <p className="text-xs font-bold text-h-text-dark">
                            {format(new Date(job.last_update), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                          </p>
                        </div>

                        <div className="bg-h-gray-bg/50 rounded-2xl p-4 border border-gray-50">
                          <div className="flex items-center gap-2 text-h-text-muted mb-1">
                            <Timer className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Estimativa de Fim</span>
                          </div>
                          <p className="text-xs font-bold text-h-text-dark">
                            {estimatedEnd 
                              ? format(estimatedEnd, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
                              : 'Calculando...'}
                          </p>
                        </div>

                        <div className={`rounded-2xl p-4 border ${
                          isFinished ? 'bg-h-green/5 border-h-green/10' : 'bg-h-gray-bg/50 border-gray-50'
                        }`}>
                          <div className="flex items-center gap-2 text-h-text-muted mb-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Fim Real</span>
                          </div>
                          <p className={`text-xs font-bold ${isFinished ? 'text-h-green' : 'text-h-text-dark'}`}>
                            {job.completion_time 
                              ? format(new Date(job.completion_time), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
                              : '--:--:--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!isFinished && (
                    <div className="px-8 py-4 bg-h-gray-bg/30 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Processando em tempo real</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-h-text-muted">
                        <span>Tempo médio histórico:</span>
                        <span className="text-h-text-dark">
                          {averageTimes[job.process_code] 
                            ? `${Math.round(averageTimes[job.process_code] / 60)} min` 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="h-20 w-20 bg-h-gray-bg rounded-full flex items-center justify-center mx-auto mb-6 text-h-text-muted opacity-20">
              <Clock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-h-text-dark mb-2">Nenhum JOB em andamento</h3>
            <p className="text-h-text-muted text-sm">
              No momento não há processos ativos sendo monitorados pelo sistema.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
