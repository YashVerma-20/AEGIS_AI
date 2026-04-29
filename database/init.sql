-- Table: User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('operator', 'engineer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Factory Metadata
CREATE TABLE IF NOT EXISTS factory_metadata (
    factory_id VARCHAR(50) PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    engine_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'healthy',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Model Versioning Log
CREATE TABLE IF NOT EXISTS model_version_log (
    version_id VARCHAR(20) PRIMARY KEY,
    contributing_factories INTEGER NOT NULL,
    validation_status VARCHAR(20) NOT NULL CHECK (validation_status IN ('passed', 'failed')),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Maintenance Ledger
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id SERIAL PRIMARY KEY,
    factory_id VARCHAR(50) NOT NULL,
    agent_diagnosis TEXT NOT NULL,
    operator_action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some mock seed data
INSERT INTO factory_metadata (factory_id, location, engine_type, status) VALUES
('factory-alpha-01', 'Houston, TX', 'Turbofan-700', 'healthy'),
('factory-beta-02', 'Munich, Germany', 'Turbofan-900', 'warning'),
('factory-gamma-03', 'Tokyo, Japan', 'Turbofan-700', 'critical')
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (username, role) VALUES
('j.doe', 'operator'),
('sys.admin', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO model_version_log (version_id, contributing_factories, validation_status) VALUES
('v1.0.0', 0, 'passed'),
('v1.0.1', 3, 'passed')
ON CONFLICT DO NOTHING;
