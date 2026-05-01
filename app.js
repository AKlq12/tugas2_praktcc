/* ============================================
   Aplikasi Notes - Frontend JavaScript
   Vanilla JS (tanpa framework)
   ============================================ */

// ============================================
// Konfigurasi
// ============================================
const API_URL = 'https://be-tugas3-tcc-177-385639935267.us-central1.run.app';

// State
let allNotes = [];
let deleteTargetId = null;

// ============================================
// DOM Elements
// ============================================
const noteForm = document.getElementById('note-form');
const noteIdInput = document.getElementById('note-id');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const formTitle = document.getElementById('form-title');
const btnCancel = document.getElementById('btn-cancel');
const btnText = document.getElementById('btn-text');
const btnSubmit = document.getElementById('btn-submit');
const notesGrid = document.getElementById('notes-grid');
const loadingEl = document.getElementById('loading');
const emptyState = document.getElementById('empty-state');
const modalOverlay = document.getElementById('modal-overlay');
const toastContainer = document.getElementById('toast-container');
const totalNotesEl = document.getElementById('total-notes');
const todayNotesEl = document.getElementById('today-notes');
const judulCount = document.getElementById('judul-count');

// ============================================
// Inisialisasi
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
    setupCharCounter();
});

// ============================================
// Character counter untuk judul
// ============================================
function setupCharCounter() {
    judulInput.addEventListener('input', () => {
        const count = judulInput.value.length;
        judulCount.textContent = `${count}/255`;
        judulCount.style.color = count > 230 ? 'var(--delete-color)' : 'var(--text-muted)';
    });
}

// ============================================
// Fetch semua catatan
// ============================================
async function fetchNotes() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        // Tambahkan pengecekan Array.isArray
        if (result.success && Array.isArray(result.data)) {
            allNotes = result.data;
            renderNotes(allNotes);
            updateStats(allNotes);
        } else {
            // Jika success tapi data bukan array, atau success false
            allNotes = []; // Reset ke array kosong agar tidak error
            renderNotes(allNotes); 
            showToast(result.message || 'Gagal memuat catatan', 'error');
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        allNotes = []; // Pastikan array kosong jika koneksi putus
        renderNotes(allNotes);
        showToast('Tidak bisa terhubung ke server', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// Render daftar catatan
// ============================================
function renderNotes(notes = []) {
    if (!notes) notes = [];
    
    notesGrid.innerHTML = '';

    if (notes.length === 0) {
        emptyState.style.display = 'block';
        notesGrid.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    notesGrid.style.display = 'grid';

    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.style.animationDelay = `${index * 0.08}s`;

        const formattedDate = formatDate(note.tanggal_dibuat);

        card.innerHTML = `
            <div class="note-card-header">
                <h3 class="note-title">${escapeHtml(note.judul)}</h3>
                <div class="note-actions">
                    <button class="btn-edit" onclick="editNote(${note.id})" title="Edit catatan">
                        ✏️
                    </button>
                    <button class="btn-delete" onclick="openDeleteModal(${note.id}, '${escapeHtml(note.judul).replace(/'/g, "\\'")}')" title="Hapus catatan">
                        🗑️
                    </button>
                </div>
            </div>
            <p class="note-content">${escapeHtml(note.isi)}</p>
            <div class="note-date">
                <span>📅</span>
                <span>${formattedDate}</span>
            </div>
        `;

        notesGrid.appendChild(card);
    });
}

// ============================================
// Handle form submit (tambah / edit)
// ============================================
async function handleSubmit(event) {
    event.preventDefault();

    const judul = judulInput.value.trim();
    const isi = isiInput.value.trim();
    const id = noteIdInput.value;

    if (!judul || !isi) {
        showToast('Judul dan isi catatan wajib diisi!', 'warning');
        return;
    }

    // Disable button
    btnSubmit.disabled = true;
    btnText.textContent = id ? 'Menyimpan...' : 'Menambahkan...';

    try {
        let response;

        if (id) {
            // Edit mode
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul, isi })
            });
        } else {
            // Tambah mode
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul, isi })
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(
                id ? 'Catatan berhasil diperbarui! ✅' : 'Catatan berhasil ditambahkan! ✅',
                'success'
            );
            resetForm();
            fetchNotes();
        } else {
            showToast(result.message || 'Gagal menyimpan catatan', 'error');
        }
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Tidak bisa terhubung ke server', 'error');
    } finally {
        btnSubmit.disabled = false;
        btnText.textContent = noteIdInput.value ? 'Simpan Perubahan' : 'Tambah Catatan';
    }
}

// ============================================
// Edit catatan
// ============================================
async function editNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (result.success) {
            const note = result.data;

            // Set form ke Edit mode
            noteIdInput.value = note.id;
            judulInput.value = note.judul;
            isiInput.value = note.isi;

            formTitle.textContent = '✏️ Edit Catatan';
            btnText.textContent = 'Simpan Perubahan';
            btnCancel.style.display = 'inline-flex';

            // Update char counter
            judulCount.textContent = `${note.judul.length}/255`;

            // Scroll ke form
            document.getElementById('form-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Focus ke judul
            judulInput.focus();
        } else {
            showToast('Gagal mengambil data catatan', 'error');
        }
    } catch (error) {
        console.error('Error fetching note:', error);
        showToast('Tidak bisa terhubung ke server', 'error');
    }
}

// ============================================
// Batal edit
// ============================================
function cancelEdit() {
    resetForm();
    showToast('Edit dibatalkan', 'warning');
}

// ============================================
// Reset form
// ============================================
function resetForm() {
    noteForm.reset();
    noteIdInput.value = '';
    formTitle.textContent = '✨ Tambah Catatan Baru';
    btnText.textContent = 'Tambah Catatan';
    btnCancel.style.display = 'none';
    judulCount.textContent = '0/255';
}

// ============================================
// Hapus catatan - Modal
// ============================================
function openDeleteModal(id, judul) {
    deleteTargetId = id;
    document.getElementById('modal-message').textContent =
        `Apakah kamu yakin ingin menghapus catatan "${judul}"? Tindakan ini tidak bisa dibatalkan.`;
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    deleteTargetId = null;
}

async function confirmDelete() {
    if (!deleteTargetId) return;

    try {
        const response = await fetch(`${API_URL}/${deleteTargetId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Catatan berhasil dihapus! 🗑️', 'success');
            fetchNotes();
        } else {
            showToast(result.message || 'Gagal menghapus catatan', 'error');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Tidak bisa terhubung ke server', 'error');
    } finally {
        closeModal();
    }
}

// ============================================
// Search / Filter catatan
// ============================================
function handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        renderNotes(allNotes);
        return;
    }

    const filtered = allNotes.filter(note =>
        note.judul.toLowerCase().includes(searchTerm) ||
        note.isi.toLowerCase().includes(searchTerm)
    );

    renderNotes(filtered);
}

// ============================================
// Update statistik
// ============================================
function updateStats(notes) {
    totalNotesEl.textContent = notes.length;

    // Hitung catatan hari ini
    const today = new Date().toDateString();
    const todayCount = notes.filter(note => {
        const noteDate = new Date(note.tanggal_dibuat).toDateString();
        return noteDate === today;
    }).length;

    todayNotesEl.textContent = todayCount;
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove setelah 3 detik
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Helper Functions
// ============================================
function showLoading(show) {
    loadingEl.style.display = show ? 'flex' : 'none';
    if (show) {
        notesGrid.style.display = 'none';
        emptyState.style.display = 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
