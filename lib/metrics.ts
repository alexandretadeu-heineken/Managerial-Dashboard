import { supabase } from './supabase';

export interface ProcessMetric {
  id: string;
  process_code: string;
  process_description: string;
  group_code: string;
  group_description: string;
  reference_date: string;
  period: string;
  job_name: string;
  program_name: string;
  variant_name: string;
  start_date: string;
  end_date: string;
  responsible_user: string;
  responsible_name: string;
  processing_time_seconds: number;
  processing_time_days: number;
  processing_time_hours: number;
  processing_time_minutes: number;
  status: string;
}

export async function fetchLatestMetrics(selectedPeriod?: string) {
  let query = supabase
    .from('process_metrics')
    .select('*')
    .order('reference_date', { ascending: false });

  if (selectedPeriod) {
    // Get all available periods to find the predecessors
    const allPeriods = await fetchAvailablePeriods();
    const selectedIndex = allPeriods.indexOf(selectedPeriod);
    
    if (selectedIndex !== -1) {
      // Take the selected period and up to 2 predecessors
      const targetPeriods = allPeriods.slice(Math.max(0, selectedIndex - 2), selectedIndex + 1);
      
      const { data, error } = await query.in('period', targetPeriods);
      if (error) {
        console.error('Error fetching metrics:', error);
        return [];
      }
      return data as ProcessMetric[];
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }

  return data as ProcessMetric[];
}

export async function fetchAvailablePeriods() {
  const { data, error } = await supabase
    .from('process_metrics')
    .select('period, reference_date')
    .order('reference_date', { ascending: true });

  if (error) {
    console.error('Error fetching periods:', error);
    return [];
  }

  // Unique periods
  const periods = Array.from(new Set(data.map(d => d.period)));
  return periods;
}

export function groupMetricsByProcess(metrics: ProcessMetric[]) {
  const grouped: Record<string, ProcessMetric[]> = {};
  
  metrics.forEach(metric => {
    const key = metric.process_code;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(metric);
  });
  
  return grouped;
}

export async function fetchLastUpdate() {
  const { data, error } = await supabase
    .from('process_metrics')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching last update:', error);
    return null;
  }

  return data[0].created_at;
}
