/**
 * Silent Disco Headsets - Auth Page Helpers
 * Additional authentication utilities for portal pages
 */

// Listen for auth state changes on all pages
Auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);

    if (event === 'SIGNED_OUT') {
        // Redirect to login unless already there
        if (!window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('forgot-password.html')) {
            window.location.href = '/portal/login.html';
        }
    }
});

/**
 * Initialize protected page
 * Call this at the start of any page that requires authentication
 */
async function initProtectedPage(options = {}) {
    const {
        requireApproved = true,
        requireAdmin = false,
        onReady = () => {}
    } = options;

    Utils.showLoading();

    const user = await Auth.getCurrentUser();

    if (!user) {
        window.location.href = '/portal/login.html';
        return false;
    }

    const profile = await Auth.getCurrentProfile();

    if (requireAdmin && !profile?.is_admin) {
        window.location.href = '/portal/dashboard.html';
        return false;
    }

    if (requireApproved && !profile?.is_approved && !profile?.is_admin) {
        window.location.href = '/portal/pending.html';
        return false;
    }

    Utils.hideLoading();
    onReady(user, profile);
    return true;
}

/**
 * Setup portal header with user menu
 */
function setupPortalHeader(profile) {
    const userBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (userName && profile) {
        userName.textContent = profile.full_name || profile.email;
    }

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await Auth.signOut();
            window.location.href = '/portal/login.html';
        });
    }
}

/**
 * Setup admin sidebar toggle for mobile
 */
function setupAdminSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
}

/**
 * Create and show a modal
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Hide a modal
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Setup modal close handlers
 */
function setupModalCloseHandlers() {
    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });
    });

    // Close on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('show');
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
}

/**
 * Confirm dialog
 */
function confirmAction(message) {
    return new Promise((resolve) => {
        const confirmed = window.confirm(message);
        resolve(confirmed);
    });
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${baseName}_${timestamp}_${randomStr}.${extension}`;
}

// Export utilities
window.initProtectedPage = initProtectedPage;
window.setupPortalHeader = setupPortalHeader;
window.setupAdminSidebar = setupAdminSidebar;
window.showModal = showModal;
window.hideModal = hideModal;
window.setupModalCloseHandlers = setupModalCloseHandlers;
window.confirmAction = confirmAction;
window.formatFileSize = formatFileSize;
window.generateUniqueFilename = generateUniqueFilename;
