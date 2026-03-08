'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { ProcessMetric } from '@/lib/metrics';

export function ManagerialJobsView() {
  const [jobs, setJobs] = useState<ProcessMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    let isMounted = true;
    
    const loadJobs = async () => {
      const { data, error } = await supabase
        .from('process_metrics')
        .select('*')
        .order('reference_date', { ascending: false });

      if (isMounted) {
        if (error) {
          console.error('Error fetching jobs:', error);
        } else {
          setJobs(data || []);
        }
        setIsLoading(false);
      }
    };

    loadJobs();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.job_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.process_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.responsible_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'finished':
      case 'sucesso':
        return 'bg-h-green/10 text-h-green border-h-green/20';
      case 'error':
      case 'falha':
        return 'bg-h-red/10 text-h-red border-h-red/20';
      default:
        return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-h-text-dark tracking-tight">Managerial JOBs</h2>
          <p className="text-h-text-muted text-sm mt-1">Listagem detalhada de execuções de JOBs</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-h-text-muted" />
            <input
              type="text"
              placeholder="Buscar por JOB, processo ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-h-green/20 focus:border-h-green transition-all"
          >
            <option value="all">Todos os Status</option>
            <option value="sucesso">Sucesso</option>
            <option value="falha">Falha</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-h-text-dark hover:bg-gray-50 transition-all">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-h-gray-bg border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">JOB / Processo</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Período</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Duração</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-h-text-muted uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    </td>
                  </tr>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-h-gray-bg/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-h-gray-bg flex items-center justify-center text-h-green group-hover:scale-110 transition-transform">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-h-text-dark">{job.job_name}</p>
                          <p className="text-[11px] text-h-text-muted">{job.process_description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-h-text-dark">
                        <Calendar className="h-3.5 w-3.5 text-h-text-muted" />
                        <span className="text-xs font-medium">{job.period}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-h-text-muted">
                          {job.responsible_name.charAt(0)}
                        </div>
                        <span className="text-xs text-h-text-dark font-medium">{job.responsible_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-h-text-dark">
                        <Clock className="h-3.5 w-3.5 text-h-text-muted" />
                        <span className="text-xs font-bold">
                          {job.processing_time_hours}h {job.processing_time_minutes}m
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(job.status)}`}>
                        {job.status.toLowerCase() === 'sucesso' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-h-text-muted hover:text-h-green transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-h-text-muted">
                      <AlertCircle className="h-8 w-8 opacity-20" />
                      <p className="text-sm font-medium">Nenhum JOB encontrado com os filtros aplicados.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
