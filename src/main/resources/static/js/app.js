const API = '/api';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');
let allContent = [];
let watchlist = [];
let currentFilter = 'ALL';
let searchTimeout = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    if (token && username) {
        setLoggedIn(username);
    }
    loadContent();
});

// ===== AUTH =====
function setLoggedIn(user) {
    username = user;
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userSection').style.display = 'flex';
    document.getElementById('usernameDisplay').textContent = user;
    document.getElementById('navLinks').style.display = 'flex';
}

function setLoggedOut() {
    token = null;
    username = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userSection').style.display = 'none';
    showSection('browse');
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', data.username);
        setLoggedIn(data.username);
        showToast('Welcome back, ' + data.username + '!', 'success');
        showSection('browse');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, email: email, password: pass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.username || data.email || data.password || 'Registration failed');

        token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', data.username);
        setLoggedIn(data.username);
        showToast('Account created successfully!', 'success');
        showSection('browse');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function logout() {
    setLoggedOut();
    showToast('Logged out successfully', 'info');
}

// ===== NAVIGATION =====
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.navbar-nav a').forEach(a => a.classList.remove('active'));

    const sectionEl = document.getElementById(section + 'Section');
    if (sectionEl) sectionEl.classList.add('active');

    const navLink = document.querySelector(`.navbar-nav a[data-section="${section}"]`);
    if (navLink) navLink.classList.add('active');

    if (section === 'watchlist' && token) {
        loadWatchlist();
        loadStats();
    }
    if (section === 'browse') {
        loadContent();
    }
}

// ===== CONTENT =====
async function loadContent() {
    const grid = document.getElementById('contentGrid');
    const loading = document.getElementById('contentLoading');
    const empty = document.getElementById('contentEmpty');

    loading.style.display = 'flex';
    grid.innerHTML = '';
    empty.style.display = 'none';

    try {
        const res = await fetch(`${API}/content`);
        allContent = await res.json();
        populateFilters();
        applyFilters();
    } catch (err) {
        showToast('Failed to load content', 'error');
    } finally {
        loading.style.display = 'none';
    }
}

function populateFilters() {
    const genres = [...new Set(allContent.map(c => c.genre).filter(Boolean))].sort();
    const platforms = [...new Set(allContent.map(c => c.platform).filter(Boolean))].sort();

    const genreSelect = document.getElementById('genreFilter');
    genreSelect.innerHTML = '<option value="">All Genres</option>' +
        genres.map(g => `<option value="${g}">${g}</option>`).join('');

    const platformSelect = document.getElementById('platformFilter');
    platformSelect.innerHTML = '<option value="">All Platforms</option>' +
        platforms.map(p => `<option value="${p}">${p}</option>`).join('');
}

function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const genre = document.getElementById('genreFilter').value;
    const platform = document.getElementById('platformFilter').value;

    let filtered = allContent.filter(c => {
        if (search && !c.title.toLowerCase().includes(search) &&
            !(c.description && c.description.toLowerCase().includes(search))) return false;
        if (type && c.type !== type) return false;
        if (genre && c.genre !== genre) return false;
        if (platform && c.platform !== platform) return false;
        return true;
    });

    renderContent(filtered);
}

function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
}

function renderContent(items) {
    const grid = document.getElementById('contentGrid');
    const empty = document.getElementById('contentEmpty');

    if (items.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    grid.innerHTML = items.map(c => `
        <div class="content-card" onclick="openAddModal(${c.id})">
            <div class="poster">
                ${c.posterUrl ? `<img src="${escapeHtml(c.posterUrl)}" alt="${escapeHtml(c.title)}" onerror="this.parentElement.innerHTML='&#127916;'">` : '&#127916;'}
            </div>
            <div class="card-body">
                <div class="card-title" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</div>
                <div class="card-meta">
                    <span>${c.releaseYear || ''}</span>
                    <span class="content-rating">${c.averageRating ? '&#11088; ' + c.averageRating : ''}</span>
                </div>
                <div class="card-tags">
                    <span class="tag tag-genre">${escapeHtml(c.type)}</span>
                    ${c.genre ? `<span class="tag tag-genre">${escapeHtml(c.genre)}</span>` : ''}
                    ${c.platform ? `<span class="tag tag-platform">${escapeHtml(c.platform)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ===== WATCHLIST =====
async function loadWatchlist() {
    if (!token) return;
    const grid = document.getElementById('watchlistGrid');
    const loading = document.getElementById('watchlistLoading');
    const empty = document.getElementById('watchlistEmpty');

    loading.style.display = 'flex';
    grid.innerHTML = '';
    empty.style.display = 'none';

    try {
        const url = currentFilter === 'ALL' ? `${API}/watchlist` : `${API}/watchlist/filter?status=${currentFilter}`;
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error('Failed to load watchlist');
        watchlist = await res.json();
        renderWatchlist(watchlist);
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        loading.style.display = 'none';
    }
}

async function loadStats() {
    if (!token) return;
    try {
        const res = await fetch(`${API}/watchlist/stats`, { headers: authHeaders() });
        if (!res.ok) return;
        const stats = await res.json();
        const total = Object.values(stats).reduce((a, b) => a + b, 0);

        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card"><div class="stat-number">${total}</div><div class="stat-label">Total</div></div>
            <div class="stat-card"><div class="stat-number">${stats.PLAN_TO_WATCH || 0}</div><div class="stat-label">Plan to Watch</div></div>
            <div class="stat-card"><div class="stat-number">${stats.WATCHING || 0}</div><div class="stat-label">Watching</div></div>
            <div class="stat-card"><div class="stat-number">${stats.COMPLETED || 0}</div><div class="stat-label">Completed</div></div>
            <div class="stat-card"><div class="stat-number">${stats.DROPPED || 0}</div><div class="stat-label">Dropped</div></div>
        `;
    } catch (err) { /* ignore */ }
}

function filterWatchlist(status) {
    currentFilter = status;
    document.querySelectorAll('.watchlist-filters .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    loadWatchlist();
}

function renderWatchlist(items) {
    const grid = document.getElementById('watchlistGrid');
    const empty = document.getElementById('watchlistEmpty');

    if (items.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    grid.innerHTML = items.map(item => {
        const badgeClass = getBadgeClass(item.status);
        const progress = item.totalEpisodes ? Math.round((item.currentEpisode || 0) / item.totalEpisodes * 100) : 0;

        return `
        <div class="watchlist-card">
            <div class="poster-sm">
                ${item.posterUrl ? `<img src="${escapeHtml(item.posterUrl)}" onerror="this.parentElement.innerHTML='&#127916;'">` : '&#127916;'}
            </div>
            <div class="item-info">
                <div class="item-title" title="${escapeHtml(item.contentTitle)}">${escapeHtml(item.contentTitle)}</div>
                <div class="item-meta">
                    <span class="badge ${badgeClass}">${formatStatus(item.status)}</span>
                    ${item.userRating ? ' &#11088; ' + item.userRating + '/10' : ''}
                </div>
                ${item.contentType === 'SERIES' && item.totalEpisodes ? `
                    <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                    <div class="progress-text">Episode ${item.currentEpisode || 0} / ${item.totalEpisodes}</div>
                ` : ''}
                ${item.notes ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.3rem">${escapeHtml(item.notes)}</div>` : ''}
                <div class="item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openEditModal(${item.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="removeFromWatchlist(${item.id})">Remove</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ===== MODALS =====
function openAddModal(contentId) {
    if (!token) {
        showToast('Please login to add items to your watchlist', 'info');
        showSection('login');
        return;
    }
    const content = allContent.find(c => c.id === contentId);
    if (!content) return;

    document.getElementById('addContentId').value = contentId;
    document.getElementById('addModalTitle').textContent = content.title;
    document.getElementById('addStatus').value = 'PLAN_TO_WATCH';
    document.getElementById('addRating').value = '';
    document.getElementById('addEpisode').value = '0';
    document.getElementById('addNotes').value = '';

    const episodeGroup = document.getElementById('addEpisodeGroup');
    episodeGroup.style.display = content.type === 'SERIES' ? 'block' : 'none';

    document.getElementById('addModal').classList.add('active');
}

async function handleAddToWatchlist(e) {
    e.preventDefault();
    const contentId = parseInt(document.getElementById('addContentId').value);
    const status = document.getElementById('addStatus').value;
    const rating = document.getElementById('addRating').value;
    const episode = document.getElementById('addEpisode').value;
    const notes = document.getElementById('addNotes').value;

    const body = { contentId, status };
    if (rating) body.userRating = parseInt(rating);
    if (episode) body.currentEpisode = parseInt(episode);
    if (notes) body.notes = notes;

    try {
        const res = await fetch(`${API}/watchlist`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add to watchlist');

        showToast('Added to watchlist!', 'success');
        closeModal('addModal');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openEditModal(itemId) {
    const item = watchlist.find(w => w.id === itemId);
    if (!item) return;

    document.getElementById('editItemId').value = item.id;
    document.getElementById('editContentId2').value = item.contentId;
    document.getElementById('editModalTitle').textContent = item.contentTitle;
    document.getElementById('editStatus').value = item.status;
    document.getElementById('editRating').value = item.userRating || '';
    document.getElementById('editEpisode').value = item.currentEpisode || 0;
    document.getElementById('editNotes').value = item.notes || '';

    const episodeGroup = document.getElementById('editEpisodeGroup');
    episodeGroup.style.display = item.contentType === 'SERIES' ? 'block' : 'none';

    document.getElementById('editModal').classList.add('active');
}

async function handleEditWatchlistItem(e) {
    e.preventDefault();
    const itemId = document.getElementById('editItemId').value;
    const contentId = parseInt(document.getElementById('editContentId2').value);
    const status = document.getElementById('editStatus').value;
    const rating = document.getElementById('editRating').value;
    const episode = document.getElementById('editEpisode').value;
    const notes = document.getElementById('editNotes').value;

    const body = { contentId, status };
    if (rating) body.userRating = parseInt(rating);
    if (episode !== '') body.currentEpisode = parseInt(episode);
    if (notes !== undefined) body.notes = notes;

    try {
        const res = await fetch(`${API}/watchlist/${itemId}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update');

        showToast('Watchlist updated!', 'success');
        closeModal('editModal');
        loadWatchlist();
        loadStats();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function removeFromWatchlist(itemId) {
    if (!confirm('Remove this item from your watchlist?')) return;

    try {
        const res = await fetch(`${API}/watchlist/${itemId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Failed to remove');

        showToast('Removed from watchlist', 'success');
        loadWatchlist();
        loadStats();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});

// ===== UTILS =====
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

function getBadgeClass(status) {
    const map = {
        'PLAN_TO_WATCH': 'badge-plan',
        'WATCHING': 'badge-watching',
        'COMPLETED': 'badge-completed',
        'DROPPED': 'badge-dropped'
    };
    return map[status] || 'badge-plan';
}

function formatStatus(status) {
    const map = {
        'PLAN_TO_WATCH': 'Plan to Watch',
        'WATCHING': 'Watching',
        'COMPLETED': 'Completed',
        'DROPPED': 'Dropped'
    };
    return map[status] || status;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
