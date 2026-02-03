# Customer Portal Setup Guide

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to initialize (takes about 2 minutes)

### 2. Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the contents of `../supabase-schema.sql` and paste it
4. Click **Run** to execute the schema

### 3. Create Storage Buckets
1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - `invoices` (private)
   - `resources` (private)

### 4. Configure the Client
1. Go to **Settings > API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**
3. Open `../js/supabase-client.js`
4. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 5. Create Your Admin Account
1. Go to `portal/register.html` in your browser
2. Register with your email
3. Go to Supabase **SQL Editor** and run:

```sql
UPDATE profiles
SET is_admin = TRUE, is_approved = TRUE
WHERE email = 'your-email@example.com';
```

### 6. Set Up Storage Policies (Important!)
Go to **Storage > Policies** and add these policies for each bucket:

#### For `invoices` bucket:

**Download Policy (SELECT)**
```sql
(EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id::text = (storage.foldername(name))[1]
  AND orders.customer_id = auth.uid()
)) OR (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
))
```

**Upload Policy (INSERT)**
```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
)
```

#### For `resources` bucket:

**Download Policy (SELECT)**
```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND (profiles.is_approved = true OR profiles.is_admin = true)
)
```

**Upload Policy (INSERT)**
```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
)
```

---

## Features Overview

### Customer Portal
- **Dashboard** - Overview of orders, stats, and upsells
- **My Orders** - Track order status with visual progress tracker
- **Resources** - Download guides, watch tutorials, access materials

### Admin Portal
- **Dashboard** - Quick stats and pending approvals
- **Customers** - View all customers, approve accounts
- **Orders** - Create orders, update status, upload invoices
- **Resources** - Upload and manage customer resources
- **Upsells** - Add products to recommend to customers

---

## User Flow

### Customer Registration
1. Customer registers at `portal/register.html`
2. Account is created with `is_approved = false`
3. Admin sees pending approval in admin dashboard
4. Admin approves the customer
5. Customer receives access to full portal

### Order Management
1. Admin creates order for approved customer
2. Admin uploads invoice PDF
3. Customer sees order in their dashboard
4. Admin updates order stage as it progresses
5. Customer can download invoice and track status

---

## File Structure

```
portal/
├── login.html          # Customer login
├── register.html       # Customer registration
├── pending.html        # Pending approval page
├── forgot-password.html# Password reset
├── dashboard.html      # Customer dashboard
├── orders.html         # Order tracking
├── resources.html      # Resources library
├── SETUP.md           # This file
└── admin/
    ├── index.html      # Admin dashboard
    ├── customers.html  # Customer management
    ├── orders.html     # Order management
    ├── resources.html  # Resource management
    └── upsells.html    # Upsell management
```

---

## Common Issues

### "User not found" error on login
- Make sure the user has verified their email (check Supabase Auth > Users)

### Storage upload fails
- Ensure storage buckets exist with correct names
- Check that storage policies are configured

### Admin features don't work
- Verify the user has `is_admin = true` in the profiles table

---

## Support

For questions about the portal, contact: huzz@nichuzz.com
