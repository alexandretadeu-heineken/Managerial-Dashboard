-- Delete existing data
DELETE FROM process_metrics;

-- Seed new data based on new rules
-- Periods: 12/2025, 01/2026, 02/2026

-- CA001: Cross Allocation - Tax Incentives - Cálculo
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('CA001', 'Cross Allocation - Tax Incentives - Cálculo', 'CA', 'Cross Allocation', '2025-12-01', '12/2025', 'JOB_CA_CALC', 'PROG_CA', 'VAR_TAX', '2025-12-01 08:00:00', '2025-12-01 10:15:00', 'U001', 'Admin', 8100, 0, 2, 15, 'otimizado'),
('CA001', 'Cross Allocation - Tax Incentives - Cálculo', 'CA', 'Cross Allocation', '2026-01-01', '01/2026', 'JOB_CA_CALC', 'PROG_CA', 'VAR_TAX', '2026-01-01 08:00:00', '2026-01-01 10:10:00', 'U001', 'Admin', 7800, 0, 2, 10, 'otimizado'),
('CA001', 'Cross Allocation - Tax Incentives - Cálculo', 'CA', 'Cross Allocation', '2026-02-01', '02/2026', 'JOB_CA_CALC', 'PROG_CA', 'VAR_TAX', '2026-02-01 08:00:00', '2026-02-01 10:20:00', 'U001', 'Admin', 8400, 0, 2, 20, 'otimizado');

-- CA002: Cross Allocation - Tax Incentives - Postagem
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('CA002', 'Cross Allocation - Tax Incentives - Postagem', 'CA', 'Cross Allocation', '2025-12-01', '12/2025', 'JOB_CA_POST', 'PROG_CA', 'VAR_TAX', '2025-12-01 11:00:00', '2025-12-01 13:30:00', 'U001', 'Admin', 9000, 0, 2, 30, 'otimizado'),
('CA002', 'Cross Allocation - Tax Incentives - Postagem', 'CA', 'Cross Allocation', '2026-01-01', '01/2026', 'JOB_CA_POST', 'PROG_CA', 'VAR_TAX', '2026-01-01 11:00:00', '2026-01-01 13:25:00', 'U001', 'Admin', 8700, 0, 2, 25, 'otimizado'),
('CA002', 'Cross Allocation - Tax Incentives - Postagem', 'CA', 'Cross Allocation', '2026-02-01', '02/2026', 'JOB_CA_POST', 'PROG_CA', 'VAR_TAX', '2026-02-01 11:00:00', '2026-02-01 13:45:00', 'U001', 'Admin', 9900, 0, 2, 45, 'otimizado');

-- CA003: Cross Allocation - PL30 e EIA - Cálculo
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('CA003', 'Cross Allocation - PL30 e EIA - Cálculo', 'CA', 'Cross Allocation', '2025-12-01', '12/2025', 'JOB_CA_PL_CALC', 'PROG_CA', 'VAR_PL', '2025-12-01 08:00:00', '2025-12-01 10:15:00', 'U001', 'Admin', 8100, 0, 2, 15, 'otimizado'),
('CA003', 'Cross Allocation - PL30 e EIA - Cálculo', 'CA', 'Cross Allocation', '2026-01-01', '01/2026', 'JOB_CA_PL_CALC', 'PROG_CA', 'VAR_PL', '2026-01-01 08:00:00', '2026-01-01 10:10:00', 'U001', 'Admin', 7800, 0, 2, 10, 'otimizado'),
('CA003', 'Cross Allocation - PL30 e EIA - Cálculo', 'CA', 'Cross Allocation', '2026-02-01', '02/2026', 'JOB_CA_PL_CALC', 'PROG_CA', 'VAR_PL', '2026-02-01 08:00:00', '2026-02-01 10:20:00', 'U001', 'Admin', 8400, 0, 2, 20, 'otimizado');

-- CA004: Cross Allocation - PL30 e EIA - Postagem
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('CA004', 'Cross Allocation - PL30 e EIA - Postagem', 'CA', 'Cross Allocation', '2025-12-01', '12/2025', 'JOB_CA_PL_POST', 'PROG_CA', 'VAR_PL', '2025-12-01 11:00:00', '2025-12-01 13:30:00', 'U001', 'Admin', 9000, 0, 2, 30, 'otimizado'),
('CA004', 'Cross Allocation - PL30 e EIA - Postagem', 'CA', 'Cross Allocation', '2026-01-01', '01/2026', 'JOB_CA_PL_POST', 'PROG_CA', 'VAR_PL', '2026-01-01 11:00:00', '2026-01-01 13:25:00', 'U001', 'Admin', 8700, 0, 2, 25, 'otimizado'),
('CA004', 'Cross Allocation - PL30 e EIA - Postagem', 'CA', 'Cross Allocation', '2026-02-01', '02/2026', 'JOB_CA_PL_POST', 'PROG_CA', 'VAR_PL', '2026-02-01 11:00:00', '2026-02-01 13:45:00', 'U001', 'Admin', 9900, 0, 2, 45, 'otimizado');

-- TDD01: TDD - Cálculo
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('TDD01', 'TDD - Cálculo', 'TDD', 'TDD', '2025-12-01', '12/2025', 'JOB_TDD_CALC', 'PROG_TDD', 'VAR_TDD', '2025-12-01 08:00:00', '2025-12-01 11:45:00', 'U002', 'User', 13500, 0, 3, 45, 'alerta'),
('TDD01', 'TDD - Cálculo', 'TDD', 'TDD', '2026-01-01', '01/2026', 'JOB_TDD_CALC', 'PROG_TDD', 'VAR_TDD', '2026-01-01 08:00:00', '2026-01-01 11:40:00', 'U002', 'User', 13200, 0, 3, 40, 'alerta'),
('TDD01', 'TDD - Cálculo', 'TDD', 'TDD', '2026-02-01', '02/2026', 'JOB_TDD_CALC', 'PROG_TDD', 'VAR_TDD', '2026-02-01 08:00:00', '2026-02-01 11:50:00', 'U002', 'User', 13800, 0, 3, 50, 'alerta');

-- TDD02: TDD - Postagem
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('TDD02', 'TDD - Postagem', 'TDD', 'TDD', '2025-12-01', '12/2025', 'JOB_TDD_POST', 'PROG_TDD', 'VAR_TDD', '2025-12-01 12:00:00', '2025-12-01 14:27:00', 'U002', 'User', 8820, 0, 2, 27, 'alerta'),
('TDD02', 'TDD - Postagem', 'TDD', 'TDD', '2026-01-01', '01/2026', 'JOB_TDD_POST', 'PROG_TDD', 'VAR_TDD', '2026-01-01 12:00:00', '2026-01-01 14:25:00', 'U002', 'User', 8700, 0, 2, 25, 'alerta'),
('TDD02', 'TDD - Postagem', 'TDD', 'TDD', '2026-02-01', '02/2026', 'JOB_TDD_POST', 'PROG_TDD', 'VAR_TDD', '2026-02-01 12:00:00', '2026-02-01 14:30:00', 'U002', 'User', 9000, 0, 2, 30, 'alerta');

-- EL001: Eliminação - Cálculo
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('EL001', 'Eliminação - Cálculo', 'ELIM', 'Eliminação', '2025-12-01', '12/2025', 'JOB_ELIM_CALC', 'PROG_ELIM', 'VAR_ELIM', '2025-12-01 08:00:00', '2025-12-01 09:50:00', 'U003', 'Manager', 6600, 0, 1, 50, 'estável'),
('EL001', 'Eliminação - Cálculo', 'ELIM', 'Eliminação', '2026-01-01', '01/2026', 'JOB_ELIM_CALC', 'PROG_ELIM', 'VAR_ELIM', '2026-01-01 08:00:00', '2026-01-01 09:45:00', 'U003', 'Manager', 6300, 0, 1, 45, 'estável'),
('EL001', 'Eliminação - Cálculo', 'ELIM', 'Eliminação', '2026-02-01', '02/2026', 'JOB_ELIM_CALC', 'PROG_ELIM', 'VAR_ELIM', '2026-02-01 08:00:00', '2026-02-01 09:55:00', 'U003', 'Manager', 6900, 0, 1, 55, 'estável');

-- EL002: Eliminação - Postagem
INSERT INTO process_metrics (process_code, process_description, group_code, group_description, reference_date, period, job_name, program_name, variant_name, start_date, end_date, responsible_user, responsible_name, processing_time_seconds, processing_time_days, processing_time_hours, processing_time_minutes, status) VALUES
('EL002', 'Eliminação - Postagem', 'ELIM', 'Eliminação', '2025-12-01', '12/2025', 'JOB_ELIM_POST', 'PROG_ELIM', 'VAR_ELIM', '2025-12-01 10:00:00', '2025-12-01 10:55:00', 'U003', 'Manager', 3300, 0, 0, 55, 'estável'),
('EL002', 'Eliminação - Postagem', 'ELIM', 'Eliminação', '2026-01-01', '01/2026', 'JOB_ELIM_POST', 'PROG_ELIM', 'VAR_ELIM', '2026-01-01 10:00:00', '2026-01-01 10:50:00', 'U003', 'Manager', 3000, 0, 0, 50, 'estável'),
('EL002', 'Eliminação - Postagem', 'ELIM', 'Eliminação', '2026-02-01', '02/2026', 'JOB_ELIM_POST', 'PROG_ELIM', 'VAR_ELIM', '2026-02-01 10:00:00', '2026-02-01 11:05:00', 'U003', 'Manager', 3900, 0, 1, 05, 'estável');
