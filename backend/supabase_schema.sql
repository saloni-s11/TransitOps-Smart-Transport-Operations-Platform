-- TransitOps Supabase Schema

-- Users & Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES 
('Fleet Manager'), ('Dispatcher'), ('Safety Officer'), ('Financial Analyst');

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    max_capacity_kg NUMERIC NOT NULL,
    odometer_km NUMERIC NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    license_no VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20) NOT NULL,
    license_expiry DATE NOT NULL,
    contact_no VARCHAR(20),
    safety_score INT CHECK (safety_score BETWEEN 0 AND 100) DEFAULT 100,
    status VARCHAR(20) CHECK (status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    cargo_weight_kg NUMERIC NOT NULL,
    planned_distance_km NUMERIC NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Maintenance
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0,
    service_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Active', 'Completed')) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fuel & Expenses
CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    liters NUMERIC NOT NULL,
    cost NUMERIC NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for Business Rules
CREATE OR REPLACE FUNCTION update_trip_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Dispatched' AND OLD.status != 'Dispatched' THEN
        -- Verify weight capacity
        IF NEW.cargo_weight_kg > (SELECT max_capacity_kg FROM vehicles WHERE id = NEW.vehicle_id) THEN
            RAISE EXCEPTION 'Cargo weight exceeds vehicle capacity';
        END IF;
        -- Update statuses to 'On Trip'
        UPDATE vehicles SET status = 'On Trip' WHERE id = NEW.vehicle_id;
        UPDATE drivers SET status = 'On Trip' WHERE id = NEW.driver_id;
    ELSIF NEW.status = 'Completed' AND OLD.status = 'Dispatched' THEN
        UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id;
        UPDATE drivers SET status = 'Available' WHERE id = NEW.driver_id;
    ELSIF NEW.status = 'Cancelled' AND OLD.status = 'Dispatched' THEN
        UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id;
        UPDATE drivers SET status = 'Available' WHERE id = NEW.driver_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_status
AFTER UPDATE ON trips
FOR EACH ROW
EXECUTE FUNCTION update_trip_status();

CREATE OR REPLACE FUNCTION handle_maintenance_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Active' THEN
        UPDATE vehicles SET status = 'In Shop' WHERE id = NEW.vehicle_id;
    ELSIF NEW.status = 'Completed' AND OLD.status = 'Active' THEN
        -- Only restore to Available if not Retired
        UPDATE vehicles SET status = 'Available' WHERE id = NEW.vehicle_id AND status != 'Retired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_handle_maintenance_status
AFTER INSERT OR UPDATE ON maintenance_logs
FOR EACH ROW
EXECUTE FUNCTION handle_maintenance_status();
