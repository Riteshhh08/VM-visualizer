-- Create VMs table
CREATE TABLE IF NOT EXISTS vms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Running', 'Idling', 'Terminated', 'Starting', 'Stopping')),
    cpu INTEGER NOT NULL DEFAULT 0 CHECK (cpu >= 0 AND cpu <= 100),
    memory INTEGER NOT NULL DEFAULT 0 CHECK (memory >= 0 AND memory <= 100),
    storage INTEGER NOT NULL DEFAULT 0 CHECK (storage >= 0 AND storage <= 100),
    ip_address INET NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vms_status ON vms(status);
CREATE INDEX IF NOT EXISTS idx_vms_region ON vms(region);
