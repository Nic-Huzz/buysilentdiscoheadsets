-- =============================================
-- SILENT DISCO HEADSETS - CUSTOMER PORTAL
-- Supabase Database Schema
-- =============================================
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CUSTOM TYPES
-- =============================================

-- Order stage enum
CREATE TYPE order_stage AS ENUM ('received', 'processing', 'shipped', 'delivered');

-- Resource file type enum
CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'audio', 'link');

-- =============================================
-- TABLES
-- =============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    headset_quantity INTEGER DEFAULT 0,
    transmitter_quantity INTEGER DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    current_stage order_stage DEFAULT 'received',
    notes TEXT,
    tracking_number TEXT,
    shipping_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDER STAGE HISTORY
CREATE TABLE order_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage order_stage NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RESOURCES
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_type resource_type NOT NULL,
    file_path TEXT NOT NULL,
    thumbnail_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. UPSELLS
CREATE TABLE upsells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_path TEXT,
    cta_text TEXT DEFAULT 'Learn More',
    cta_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_approved ON profiles(is_approved);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_stage ON orders(current_stage);
CREATE INDEX idx_order_history_order ON order_stage_history(order_id);
CREATE INDEX idx_invoices_order ON invoices(order_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_active ON resources(is_active);
CREATE INDEX idx_upsells_active ON upsells(is_active);
CREATE INDEX idx_upsells_order ON upsells(display_order);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, phone, company_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'company_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log order stage changes
CREATE OR REPLACE FUNCTION log_order_stage_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.current_stage IS DISTINCT FROM NEW.current_stage THEN
        INSERT INTO order_stage_history (order_id, stage, notes)
        VALUES (NEW.id, NEW.current_stage, 'Stage updated');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Updated at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_upsells_updated_at
    BEFORE UPDATE ON upsells
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Order stage history trigger
CREATE TRIGGER log_order_stage
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_stage_change();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsells ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (except admin/approved status)
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
        AND is_approved = (SELECT is_approved FROM profiles WHERE id = auth.uid())
    );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ORDERS policies
-- Customers can read their own orders
CREATE POLICY "Customers can read own orders"
    ON orders FOR SELECT
    USING (customer_id = auth.uid());

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can insert orders
CREATE POLICY "Admins can insert orders"
    ON orders FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can update orders
CREATE POLICY "Admins can update orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can delete orders
CREATE POLICY "Admins can delete orders"
    ON orders FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ORDER_STAGE_HISTORY policies
-- Customers can read their order history
CREATE POLICY "Customers can read own order history"
    ON order_stage_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_stage_history.order_id
            AND orders.customer_id = auth.uid()
        )
    );

-- Admins can read all order history
CREATE POLICY "Admins can read all order history"
    ON order_stage_history FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- INVOICES policies
-- Customers can read their own invoices
CREATE POLICY "Customers can read own invoices"
    ON invoices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = invoices.order_id
            AND orders.customer_id = auth.uid()
        )
    );

-- Admins can manage all invoices
CREATE POLICY "Admins can read all invoices"
    ON invoices FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert invoices"
    ON invoices FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete invoices"
    ON invoices FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- RESOURCES policies
-- Approved customers can read active resources
CREATE POLICY "Approved customers can read resources"
    ON resources FOR SELECT
    USING (
        is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_approved = TRUE
        )
    );

-- Admins can manage all resources
CREATE POLICY "Admins can read all resources"
    ON resources FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert resources"
    ON resources FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update resources"
    ON resources FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete resources"
    ON resources FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- UPSELLS policies
-- Approved customers can read active upsells
CREATE POLICY "Approved customers can read upsells"
    ON upsells FOR SELECT
    USING (
        is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_approved = TRUE
        )
    );

-- Admins can manage all upsells
CREATE POLICY "Admins can read all upsells"
    ON upsells FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert upsells"
    ON upsells FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update upsells"
    ON upsells FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete upsells"
    ON upsells FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Run these in the Supabase Dashboard > Storage or via SQL

-- Create buckets (run via Dashboard or with service role)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', false);

-- Storage policies will need to be set up via Dashboard:
-- 1. invoices bucket:
--    - Admins can upload/delete
--    - Customers can download their own order's invoices
-- 2. resources bucket:
--    - Admins can upload/delete
--    - Approved customers can download

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Create a test admin user (after signing up, run this to make them admin)
-- UPDATE profiles SET is_admin = TRUE, is_approved = TRUE WHERE email = 'your-admin@email.com';

-- Sample resource categories for reference:
-- 'Setup Guides', 'Event Planning', 'Tutorials', 'Marketing Materials', 'Technical Docs'
