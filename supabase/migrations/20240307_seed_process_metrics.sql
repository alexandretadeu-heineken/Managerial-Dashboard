-- Mock data for process_metrics
insert into process_metrics (
  process_code, process_description, group_code, group_description, 
  reference_date, period, job_name, program_name, variant_name, 
  start_date, end_date, responsible_user, responsible_name, 
  processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, 
  status
) values 
-- Cross Allocation - Tax Incentives
('CA001', 'Cálculo de Tax Incentives e ATL/BTL', 'CROSS', 'Cross Allocation', '2026-01-31', '01/2026', 'ZCO0025-01-2026', 'ZCO0025', 'ZCO0025-CALC', '2026-02-05 08:00:00', '2026-02-05 12:25:00', 'ALMEIA13', 'Alexandre Tadu de Almeida', 15900, 0, 4, 25, 'Concluído'),
('CA001', 'Cálculo de Tax Incentives e ATL/BTL', 'CROSS', 'Cross Allocation', '2025-12-31', '12/2025', 'ZCO0025-12-2025', 'ZCO0025', 'ZCO0025-CALC', '2026-01-05 08:00:00', '2026-01-05 13:10:00', 'ALMEIA13', 'Alexandre Tadu de Almeida', 18600, 0, 5, 10, 'Concluído'),

-- Cross Allocation - PL30 e EIA
('CA002', 'Cálculo de PL30 e EIA', 'CROSS', 'Cross Allocation', '2026-01-31', '01/2026', 'ZCO0026-01-2026', 'ZCO0026', 'ZCO0026-CALC', '2026-02-06 09:00:00', '2026-02-06 13:25:00', 'ALMEIA13', 'Alexandre Tadu de Almeida', 15900, 0, 4, 25, 'Concluído'),
('CA002', 'Cálculo de PL30 e EIA', 'CROSS', 'Cross Allocation', '2025-12-31', '12/2025', 'ZCO0026-12-2025', 'ZCO0026', 'ZCO0026-CALC', '2026-01-06 09:00:00', '2026-01-06 14:10:00', 'ALMEIA13', 'Alexandre Tadu de Almeida', 18600, 0, 5, 10, 'Concluído'),

-- TDD
('TDD001', 'Processamento TDD', 'TDD', 'TDD', '2026-01-31', '01/2026', 'ZTDD001-01-2026', 'ZTDD001', 'ZTDD001-VAR', '2026-02-07 10:00:00', '2026-02-07 16:12:00', 'SILVA22', 'Ricardo Silva', 22320, 0, 6, 12, 'Concluído'),
('TDD001', 'Processamento TDD', 'TDD', 'TDD', '2025-12-31', '12/2025', 'ZTDD001-12-2025', 'ZTDD001', 'ZTDD001-VAR', '2026-01-07 10:00:00', '2026-01-07 15:45:00', 'SILVA22', 'Ricardo Silva', 20700, 0, 5, 45, 'Concluído'),

-- Eliminação
('ELIM001', 'Processamento de Eliminação', 'ELIM', 'Eliminação', '2026-01-31', '01/2026', 'ZELIM01-01-2026', 'ZELIM01', 'ZELIM01-VAR', '2026-02-08 14:00:00', '2026-02-08 16:45:00', 'GOMES45', 'Maria Gomes', 9900, 0, 2, 45, 'Concluído'),
('ELIM001', 'Processamento de Eliminação', 'ELIM', 'Eliminação', '2025-12-31', '12/2025', 'ZELIM01-12-2025', 'ZELIM01', 'ZELIM01-VAR', '2026-01-08 14:00:00', '2026-01-08 15:50:00', 'GOMES45', 'Maria Gomes', 6600, 0, 1, 50, 'Concluído');
