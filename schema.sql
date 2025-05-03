-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================
-- 1. Product Table
-- ========================
CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- 2. Inventory Snapshot (ERP Truth Table)
-- ========================
CREATE TABLE IF NOT EXISTS daily_inventory_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    quantity_at_bod INT NOT NULL,
    quantity_at_eod INT,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, snapshot_date)
);

-- ========================
-- 3. Inventory Activity Logs
-- ========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_change_type') THEN
        CREATE TYPE inventory_change_type AS ENUM (
            'SOLD',
            'RESTOCKED',
            'RETURNED',
            'WASTED',
            'ADJUSTED'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS daily_inventory_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    change_type inventory_change_type NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    source TEXT,
    note TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, activity_date, change_type, source, note)
);
