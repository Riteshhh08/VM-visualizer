-- Insert sample VM data
INSERT INTO vms (name, region, status, cpu, memory, storage, ip_address) VALUES
('web-server-prod', 'US East (N. Virginia)', 'Running', 75, 68, 45, '54.123.45.67'),
('database-primary', 'EU West (Ireland)', 'Running', 45, 82, 67, '34.245.78.90'),
('api-gateway', 'Asia Pacific (Tokyo)', 'Idling', 12, 25, 23, '13.114.56.78'),
('backup-server', 'US West (Oregon)', 'Terminated', 0, 0, 89, '52.89.123.45'),
('dev-environment', 'EU Central (Frankfurt)', 'Starting', 35, 40, 15, '18.195.67.89')
ON CONFLICT (id) DO NOTHING;
