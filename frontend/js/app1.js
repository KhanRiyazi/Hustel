// API Base URL
const API_BASE = 'http://localhost:8000';

// Global variables
let currentLinks = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 LinkFlow Pro Dashboard initialized');
    initializeApp();
});

async function initializeApp() {
    try {
        await loadDashboardData();
        setupEventListeners();
        console.log('✅ Dashboard fully loaded');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });

    // Create Link buttons
    const newLinkBtn = document.getElementById('newLinkBtn');
    const createLinkBtn = document.getElementById('createLinkBtn');

    if (newLinkBtn) newLinkBtn.addEventListener('click', openCreateLinkModal);
    if (createLinkBtn) createLinkBtn.addEventListener('click', openCreateLinkModal);

    // Modal controls
    const closeModalBtn = document.querySelector('[onclick="closeModal()"]');
    const cancelBtn = document.querySelector('.btn-secondary[onclick="closeModal()"]');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeCreateLinkModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCreateLinkModal);

    // Form submission
    const createLinkForm = document.getElementById('createLinkForm');
    if (createLinkForm) {
        createLinkForm.addEventListener('submit', handleCreateLink);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Quick actions
    document.querySelectorAll('.metric-card[onclick]').forEach(card => {
        card.addEventListener('click', function () {
            const action = this.getAttribute('onclick');
            if (action) {
                eval(action);
            }
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('createLinkModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeCreateLinkModal();
            }
        });
    }

    console.log('✅ Event listeners setup complete');
}

// Navigation handler
function handleNavigation(navItem) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to clicked item
    navItem.classList.add('active');

    // Get the page from data attribute or text content
    const page = navItem.getAttribute('data-page') ||
        navItem.textContent.toLowerCase().trim();

    console.log(`📄 Navigating to: ${page}`);
    showNotification(`Navigating to ${page} page...`, 'info');
}

// Load dashboard data
async function loadDashboardData() {
    try {
        console.log('📊 Loading dashboard data...');

        // Show loading state
        showLoadingState();

        // Load stats
        const statsResponse = await fetch('/dashboard/stats');
        if (!statsResponse.ok) {
            throw new Error(`Stats API error: ${statsResponse.status}`);
        }
        const stats = await statsResponse.json();

        console.log('✅ Stats loaded:', stats);
        updateDashboardMetrics(stats);

        // Load links
        const linksResponse = await fetch('/links/');
        if (!linksResponse.ok) {
            throw new Error(`Links API error: ${linksResponse.status}`);
        }
        const links = await linksResponse.json();

        console.log('✅ Links loaded:', links);
        currentLinks = links;
        displayLinks(links);

        // Hide loading state
        hideLoadingState();

    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        showNotification(`Error loading data: ${error.message}`, 'error');
        displayErrorState();
    }
}

// Show loading state
function showLoadingState() {
    const linksTableBody = document.getElementById('linksTableBody');
    if (linksTableBody) {
        linksTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem;">
                    <div class="loading"></div>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Loading your links...</p>
                </td>
            </tr>
        `;
    }
}

// Hide loading state
function hideLoadingState() {
    // Loading state is replaced when data loads
}

// Display error state
function displayErrorState() {
    const linksTableBody = document.getElementById('linksTableBody');
    if (linksTableBody) {
        linksTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--error);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Failed to load data. Please check your connection and try again.</p>
                    <button class="btn btn-primary" onclick="loadDashboardData()" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </td>
            </tr>
        `;
    }
}

// Update dashboard metrics
function updateDashboardMetrics(stats) {
    const metrics = {
        'totalClicks': stats.total_clicks.toLocaleString(),
        'totalRevenue': `$${stats.total_revenue.toLocaleString()}`,
        'conversionRateCard': `${stats.conversion_rate}%`,
        'activeCampaigns': stats.active_campaigns
    };

    for (const [id, value] of Object.entries(metrics)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Update sidebar stats
    const monthlyRevenue = document.getElementById('monthlyRevenue');
    const activeLinks = document.getElementById('activeLinks');
    const conversionRate = document.getElementById('conversionRate');

    if (monthlyRevenue) monthlyRevenue.textContent = `$${Math.round(stats.total_revenue * 0.3).toLocaleString()}`;
    if (activeLinks) activeLinks.textContent = stats.total_links;
    if (conversionRate) conversionRate.textContent = `${stats.conversion_rate}%`;
}

// Display links in the table
function displayLinks(links) {
    const linksTableBody = document.getElementById('linksTableBody');

    if (!linksTableBody) {
        console.error('❌ Links table body element not found');
        return;
    }

    if (!links || links.length === 0) {
        linksTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-link" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                    <h3 style="color: var(--text); margin-bottom: 0.5rem;">No links yet</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Create your first affiliate link to get started!</p>
                    <button class="btn btn-primary" onclick="openCreateLinkModal()">
                        <i class="fas fa-plus"></i> Create Your First Link
                    </button>
                </td>
            </tr>
        `;
        return;
    }

    const linksHTML = links.map(link => `
        <tr class="fade-in">
            <td>
                <div class="link-info">
                    <div class="link-title">${escapeHtml(link.title)}</div>
                    <a href="${link.short_url}" target="_blank" class="link-url" onclick="trackClick('${link.short_code}')">
                        ${link.short_url}
                    </a>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                        → ${truncateUrl(link.destination_url, 50)}
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge ${link.status === 'active' ? 'status-active' : 'status-paused'}">
                    ${link.status === 'active' ? 'Active' : 'Paused'}
                </span>
            </td>
            <td style="font-weight: 600; color: var(--text);">${link.clicks.toLocaleString()}</td>
            <td style="font-weight: 600; color: var(--success);">$${link.revenue.toLocaleString()}</td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn" onclick="viewAnalytics(${link.id})" title="Analytics">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                    <button class="action-btn" onclick="editLink(${link.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="copyLink('${link.short_url}')" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    linksTableBody.innerHTML = linksHTML;
}

// Modal functions
function openCreateLinkModal() {
    const modal = document.getElementById('createLinkModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('linkTitle').focus();
    }
}

function closeCreateLinkModal() {
    const modal = document.getElementById('createLinkModal');
    const form = document.getElementById('createLinkForm');

    if (modal) modal.style.display = 'none';
    if (form) form.reset();
}

// Handle create link form submission
async function handleCreateLink(e) {
    e.preventDefault();

    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('destinationUrl').value.trim();
    const category = document.getElementById('linkCategory').value;

    // Validation
    if (!title) {
        showNotification('Please enter a link title', 'error');
        return;
    }

    if (!url) {
        showNotification('Please enter a destination URL', 'error');
        return;
    }

    // Validate URL format
    if (!isValidUrl(url)) {
        showNotification('Please enter a valid URL starting with http:// or https://', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Creating...';
        submitBtn.disabled = true;

        const response = await fetch('/links/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                destination_url: url,
                category: category
            })
        });

        if (response.ok) {
            const newLink = await response.json();
            showNotification(`✅ Link created successfully! Short URL: ${newLink.short_url}`, 'success');
            closeCreateLinkModal();
            await loadDashboardData(); // Refresh the data
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

    } catch (error) {
        console.error('❌ Error creating link:', error);
        showNotification(`Failed to create link: ${error.message}`, 'error');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Link';
            submitBtn.disabled = false;
        }
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const rows = document.querySelectorAll('#linksTableBody tr');

    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Show no results message if needed
    if (visibleCount === 0 && searchTerm && rows.length > 0) {
        const linksTableBody = document.getElementById('linksTableBody');
        linksTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No links found matching "${searchTerm}"</p>
                    <button class="btn btn-secondary" onclick="clearSearch()" style="margin-top: 1rem;">
                        Clear Search
                    </button>
                </td>
            </tr>
        `;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        displayLinks(currentLinks);
    }
}

// Utility functions
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function truncateUrl(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

function trackClick(shortCode) {
    console.log(`🖱️ Tracking click for: ${shortCode}`);
    // The actual tracking happens via the backend redirect
}

function viewAnalytics(linkId) {
    const link = currentLinks.find(l => l.id === linkId);
    if (link) {
        showNotification(`📊 Analytics for "${link.title}" - Coming soon!`, 'info');
    }
}

function editLink(linkId) {
    const link = currentLinks.find(l => l.id === linkId);
    if (link) {
        showNotification(`✏️ Edit "${link.title}" - Coming soon!`, 'info');
    }
}

async function copyLink(url) {
    try {
        await navigator.clipboard.writeText(url);
        showNotification('✅ Link copied to clipboard!', 'success');
    } catch (err) {
        console.error('❌ Failed to copy:', err);
        showNotification('Failed to copy link', 'error');
    }
}

// Quick actions
function createNewLink() {
    openCreateLinkModal();
}

function viewReports() {
    showNotification('📈 Detailed reports coming soon!', 'info');
}

function exportData() {
    showNotification('📥 Export functionality coming soon!', 'info');
}

function openSettings() {
    showNotification('⚙️ Settings page coming soon!', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${icons[type] || 'info-circle'}" 
               style="color: ${getNotificationColor(type)};"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius)',
        color: 'var(--text)',
        background: 'var(--card)',
        border: `1px solid ${getNotificationColor(type)}20`,
        boxShadow: 'var(--shadow-lg)',
        zIndex: '3000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out',
        backdropFilter: 'blur(10px)'
    });

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    const colors = {
        'success': 'var(--success)',
        'error': 'var(--error)',
        'warning': 'var(--warning)',
        'info': 'var(--primary)'
    };
    return colors[type] || 'var(--primary)';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    
    input:focus, select:focus {
        outline: none;
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }
    
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: var(--primary);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.openCreateLinkModal = openCreateLinkModal;
window.closeCreateLinkModal = closeCreateLinkModal;
window.loadDashboardData = loadDashboardData;
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.trackClick = trackClick;
window.viewAnalytics = viewAnalytics;
window.editLink = editLink;
window.copyLink = copyLink;
window.createNewLink = createNewLink;
window.viewReports = viewReports;
window.exportData = exportData;
window.openSettings = openSettings;
window.showNotification = showNotification;

console.log('✅ JavaScript loaded successfully');