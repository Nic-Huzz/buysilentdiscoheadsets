-- =============================================
-- INVITE CODES MIGRATION
-- Run this in the Supabase SQL Editor
-- =============================================

-- Add invite_code column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_code TEXT;

-- Create invite_codes table
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

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active);

-- Enable RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can validate active invite codes (needed for registration page)
CREATE POLICY "Anyone can validate invite codes"
    ON invite_codes FOR SELECT
    USING (is_active = TRUE);

-- Admins can read ALL invite codes (including inactive)
CREATE POLICY "Admins can read all invite codes"
    ON invite_codes FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can create invite codes
CREATE POLICY "Admins can insert invite codes"
    ON invite_codes FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can update invite codes
CREATE POLICY "Admins can update invite codes"
    ON invite_codes FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Admins can delete invite codes
CREATE POLICY "Admins can delete invite codes"
    ON invite_codes FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Update handle_new_user to store invite code and increment usage
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
