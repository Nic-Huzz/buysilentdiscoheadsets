-- =============================================
-- SILENT DISCO HEADSETS - COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CUSTOM TYPES
-- =============================================

CREATE TYPE order_stage AS ENUM ('received', 'processing', 'shipped', 'delivered');
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
    invite_code TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVITE CODES
CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    label TEXT,
    max_uses INTEGER DEFAULT 1,
    uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS
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

-- 4. ORDER STAGE HISTORY
CREATE TABLE order_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage order_stage NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RESOURCES
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

-- 7. UPSELLS
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
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active);
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

-- Function to handle new user registration (with invite code support)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, phone, company_name, invite_code)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
        NEW.raw_user_meta_data->>'invite_code'
    );

    -- Increment invite code usage
    IF NEW.raw_user_meta_data->>'invite_code' IS NOT NULL THEN
        UPDATE invite_codes
        SET uses = uses + 1
        WHERE code = NEW.raw_user_meta_data->>'invite_code';
    END IF;

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
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsells ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
        AND is_approved = (SELECT is_approved FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- INVITE CODES policies
CREATE POLICY "Anyone can validate invite codes"
    ON invite_codes FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can read all invite codes"
    ON invite_codes FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert invite codes"
    ON invite_codes FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update invite codes"
    ON invite_codes FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete invite codes"
    ON invite_codes FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ORDERS policies
CREATE POLICY "Customers can read own orders"
    ON orders FOR SELECT
    USING (customer_id = auth.uid());

CREATE POLICY "Admins can read all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can insert orders"
    ON orders FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can update orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can delete orders"
    ON orders FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ORDER_STAGE_HISTORY policies
CREATE POLICY "Customers can read own order history"
    ON order_stage_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_stage_history.order_id
            AND orders.customer_id = auth.uid()
        )
    );

CREATE POLICY "Admins can read all order history"
    ON order_stage_history FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- INVOICES policies
CREATE POLICY "Customers can read own invoices"
    ON invoices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = invoices.order_id
            AND orders.customer_id = auth.uid()
        )
    );

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
CREATE POLICY "Approved customers can read resources"
    ON resources FOR SELECT
    USING (
        is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_approved = TRUE
        )
    );

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
CREATE POLICY "Approved customers can read upsells"
    ON upsells FOR SELECT
    USING (
        is_active = TRUE
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_approved = TRUE
        )
    );

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
-- STORAGE BUCKETS (create via Dashboard)
-- =============================================
-- Go to Storage in Supabase Dashboard and create:
-- 1. 'invoices' bucket (private)
-- 2. 'resources' bucket (private)

-- =============================================
-- AFTER SETUP: Make yourself admin
-- =============================================
-- After registering, run this with your email:
-- UPDATE profiles SET is_admin = TRUE, is_approved = TRUE WHERE email = 'your-email@example.com';
