-- Ember & Oak BBQ Database Schema

-- Drop tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS admin_users;

-- Menu Items Table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(8, 2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('dinner', 'drinks', 'specials')),
    image_url TEXT DEFAULT '/images/default-dish.jpg',
    is_happy_hour BOOLEAN DEFAULT FALSE,
    happy_hour_price DECIMAL(8, 2),
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table (popup, general config)
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_menu_category ON menu_items(category);
CREATE INDEX idx_menu_happy_hour ON menu_items(is_happy_hour);
CREATE INDEX idx_menu_available ON menu_items(is_available);
CREATE INDEX idx_settings_key ON site_settings(setting_key);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, is_active) VALUES
    ('landing_popup', 'Welcome to Ember & Oak BBQ! Ask about our daily specials.', FALSE),
    ('popup_title', 'Welcome!', TRUE),
    ('restaurant_phone', '(828) 555-0142', TRUE),
    ('restaurant_email', 'info@emberandoak.com', TRUE),
    ('restaurant_address', '127 Smokehouse Lane, Asheville, NC 28801', TRUE);
