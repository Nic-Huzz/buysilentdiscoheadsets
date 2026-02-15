/**
 * Silent Disco Headsets - Supabase Client
 */

// Prevent double initialization
if (window._supabaseClientInitialized) {
    console.warn('Supabase client already initialized');
} else {
    window._supabaseClientInitialized = true;
}

// ==============================================
// CONFIGURATION
// ==============================================

const SUPABASE_URL = 'https://gjttekhkgjfuiykwkuek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdHRla2hrZ2pmdWl5a3drdWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjg0MTIsImV4cCI6MjA4NTgwNDQxMn0.0i7EoEzkplOh4pV-SZeSviUBfX73OhJ0oQ8qB8KoYsI';

// ==============================================
// SUPABASE CLIENT INITIALIZATION
// ==============================================

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==============================================
// AUTH HELPERS
// ==============================================

const Auth = {
    /**
     * Get the current logged-in user
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) {
            // "Auth session missing" is expected on public pages - don't log it
            if (!error.message.includes('session missing')) {
                console.error('Error getting user:', error.message);
            }
            return null;
        }
        return user;
    },

    /**
     * Get the current user's profile with approval status
     */
    async getCurrentProfile() {
        const user = await this.getCurrentUser();
        if (!user) return null;

        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error getting profile:', error.message);
            return null;
        }
        return data;
    },

    /**
     * Check if user is logged in
     */
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return user !== null;
    },

    /**
     * Check if user is approved
     */
    async isApproved() {
        const profile = await this.getCurrentProfile();
        return profile?.is_approved || false;
    },

    /**
     * Check if user is admin
     */
    async isAdmin() {
        const profile = await this.getCurrentProfile();
        return profile?.is_admin || false;
    },

    /**
     * Sign up a new user with magic link (OTP)
     */
    async signUpWithOTP(email, metadata = {}) {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            email,
            options: {
                data: {
                    full_name: metadata.fullName || '',
                    phone: metadata.phone || '',
                    company_name: metadata.companyName || '',
                    invite_code: metadata.inviteCode || ''
                },
                emailRedirectTo: `${window.location.origin}/portal/orders.html`
            }
        });

        if (error) {
            throw new Error(error.message);
        }
        return data;
    },

    /**
     * Sign in with magic link (OTP)
     */
    async signInWithOTP(email) {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/portal/orders.html`
            }
        });

        if (error) {
            throw new Error(error.message);
        }
        return data;
    },

    /**
     * Sign out the current user
     */
    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Send password reset email
     */
    async resetPassword(email) {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/portal/reset-password.html`
        });

        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Update password (when user clicks reset link)
     */
    async updatePassword(newPassword) {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) {
            throw new Error(error.message);
        }
    },

    /**
     * Listen for auth state changes
     */
    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

// ==============================================
// DATABASE HELPERS
// ==============================================

const DB = {
    // PROFILES
    profiles: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getById(id) {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async update(id, updates) {
            const { data, error } = await supabaseClient
                .from('profiles')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async approve(id) {
            return this.update(id, {
                is_approved: true,
                approved_at: new Date().toISOString()
            });
        },

        async getPending() {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('is_approved', false)
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        }
    },

    // ORDERS
    orders: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email, company_name),
                    invoices(*)
                `)
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getByCustomer(customerId) {
            const { data, error } = await supabaseClient
                .from('orders')
                .select(`
                    *,
                    invoices(*)
                `)
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getById(id) {
            const { data, error } = await supabaseClient
                .from('orders')
                .select(`
                    *,
                    customer:profiles(id, full_name, email, company_name),
                    invoices(*)
                `)
                .eq('id', id)
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async create(orderData) {
            const { data, error } = await supabaseClient
                .from('orders')
                .insert(orderData)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async update(id, updates) {
            const { data, error } = await supabaseClient
                .from('orders')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async updateStage(id, stage, notes = '') {
            const { data, error } = await supabaseClient
                .from('orders')
                .update({ current_stage: stage })
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('orders')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        }
    },

    // ORDER STAGE HISTORY
    orderHistory: {
        async getByOrder(orderId) {
            const { data, error } = await supabaseClient
                .from('order_stage_history')
                .select('*')
                .eq('order_id', orderId)
                .order('created_at', { ascending: true });
            if (error) throw new Error(error.message);
            return data;
        }
    },

    // INVOICES
    invoices: {
        async create(invoiceData) {
            const { data, error } = await supabaseClient
                .from('invoices')
                .insert(invoiceData)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('invoices')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        }
    },

    // RESOURCES
    resources: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('resources')
                .select('*')
                .order('category')
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getActive() {
            const { data, error } = await supabaseClient
                .from('resources')
                .select('*')
                .eq('is_active', true)
                .order('category')
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getByCategory(category) {
            const { data, error } = await supabaseClient
                .from('resources')
                .select('*')
                .eq('category', category)
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async getCategories() {
            const { data, error } = await supabaseClient
                .from('resources')
                .select('category')
                .eq('is_active', true);
            if (error) throw new Error(error.message);
            return [...new Set(data.map(r => r.category))];
        },

        async create(resourceData) {
            const { data, error } = await supabaseClient
                .from('resources')
                .insert(resourceData)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async update(id, updates) {
            const { data, error } = await supabaseClient
                .from('resources')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('resources')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        }
    },

    // INVITE CODES
    inviteCodes: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('invite_codes')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },

        async create(codeData) {
            const { data, error } = await supabaseClient
                .from('invite_codes')
                .insert(codeData)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async update(id, updates) {
            const { data, error } = await supabaseClient
                .from('invite_codes')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('invite_codes')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        },

        async validate(code) {
            const { data, error } = await supabaseClient
                .from('invite_codes')
                .select('*')
                .eq('code', code)
                .eq('is_active', true)
                .single();

            if (error || !data) return { valid: false, reason: 'Invalid invite code' };
            if (data.max_uses > 0 && data.uses >= data.max_uses) return { valid: false, reason: 'This invite code has reached its usage limit' };
            if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, reason: 'This invite code has expired' };

            return { valid: true, data };
        },

        generateCode() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            return `SDH-${segment()}-${segment()}`;
        }
    },

    // UPSELLS
    upsells: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('upsells')
                .select('*')
                .order('display_order');
            if (error) throw new Error(error.message);
            return data;
        },

        async getActive() {
            const { data, error } = await supabaseClient
                .from('upsells')
                .select('*')
                .eq('is_active', true)
                .order('display_order');
            if (error) throw new Error(error.message);
            return data;
        },

        async create(upsellData) {
            const { data, error } = await supabaseClient
                .from('upsells')
                .insert(upsellData)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async update(id, updates) {
            const { data, error } = await supabaseClient
                .from('upsells')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        },

        async delete(id) {
            const { error } = await supabaseClient
                .from('upsells')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        }
    }
};

// ==============================================
// STORAGE HELPERS
// ==============================================

const Storage = {
    /**
     * Upload a file to a bucket
     */
    async upload(bucket, path, file) {
        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });
        if (error) throw new Error(error.message);
        return data;
    },

    /**
     * Get a signed URL for private file download
     */
    async getSignedUrl(bucket, path, expiresIn = 3600) {
        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);
        if (error) throw new Error(error.message);
        return data.signedUrl;
    },

    /**
     * Get public URL (for public buckets only)
     */
    getPublicUrl(bucket, path) {
        const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    },

    /**
     * Delete a file from a bucket
     */
    async delete(bucket, paths) {
        const { error } = await supabaseClient.storage
            .from(bucket)
            .remove(Array.isArray(paths) ? paths : [paths]);
        if (error) throw new Error(error.message);
    },

    /**
     * List files in a bucket path
     */
    async list(bucket, path = '') {
        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .list(path);
        if (error) throw new Error(error.message);
        return data;
    }
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const Utils = {
    /**
     * Format date to readable string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format date with time
     */
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Format currency (AUD)
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD'
        }).format(amount);
    },

    /**
     * Get order stage display info
     */
    getStageInfo(stage) {
        const stages = {
            received: { label: 'Order Received', icon: '1', color: '#5e17eb' },
            processing: { label: 'Manufacturing', icon: '2', color: '#5e17eb' },
            shipped: { label: 'Shipped', icon: '3', color: '#5e17eb' },
            delivered: { label: 'Delivered', icon: '4', color: '#22c55e' }
        };
        return stages[stage] || stages.received;
    },

    /**
     * Get resource type icon
     */
    getResourceIcon(type) {
        const icons = {
            pdf: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            video: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
            audio: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
            link: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
        };
        return icons[type] || icons.link;
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(overlay);
        }
        overlay.classList.add('show');
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
};

// ==============================================
// ROUTE PROTECTION
// ==============================================

const ProtectedRoute = {
    /**
     * Check if user can access the page
     * Redirects to login if not authenticated
     */
    async check(requireAdmin = false) {
        const user = await Auth.getCurrentUser();

        if (!user) {
            window.location.href = '/portal/login.html';
            return false;
        }

        if (requireAdmin) {
            const profile = await Auth.getCurrentProfile();
            if (!profile?.is_admin) {
                window.location.href = '/portal/orders.html';
                return false;
            }
        }

        return true;
    }
};

// Export for use in other modules
window.Auth = Auth;
window.DB = DB;
window.Storage = Storage;
window.Utils = Utils;
window.ProtectedRoute = ProtectedRoute;
