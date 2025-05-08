// Handles all DOM and UI logic for the journal app
import { getEntries, saveEntries } from './storage.js';
import { addEntry, updateEntry, deleteEntry, exportData, calculateCurrentStreak } from './journal.js';
import { initializeStatistics } from './statistics.js';

// DOM Elements
const body = document.body;

const addEntryBtn = document.getElementById('add-entry-btn');
const entryForm = document.getElementById('entry-form');
const closeFormBtn = document.getElementById('close-form');
const journalForm = document.getElementById('journal-form');
const formTitle = document.getElementById('form-title');
const entryDetail = document.getElementById('entry-detail');
const closeDetail = document.getElementById('close-detail');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const confirmModal = document.getElementById('confirm-modal');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');
const journalEntries = document.getElementById('journal-entries');
const searchInput = document.getElementById('search-input');
const moodFilter = document.getElementById('mood-filter');
const exportDataBtn = document.getElementById('export-data');
const emptyState = document.getElementById('empty-state');
const emptyDescription = document.getElementById('empty-description');

let lastScrollPosition = 0;
let isScrollingDown = false;
let scrollTimeout;

// Initialize the application
export function init() {
  initializeTheme();
  setupEventListeners();
  if (journalEntries) {
    renderJournalEntries();
  }
  if (document.querySelector('.stats-page')) {
    initializeStatistics();
  }
  setActivePage();
}



function setupEventListeners() {
  if (document.querySelector('.bottom-nav')) {
    window.addEventListener('scroll', handleScroll);
  }
  if (addEntryBtn) addEntryBtn.addEventListener('click', showEntryForm);
  if (closeFormBtn) closeFormBtn.addEventListener('click', hideEntryForm);
  if (journalForm) journalForm.addEventListener('submit', handleFormSubmit);
  if (closeDetail) closeDetail.addEventListener('click', hideEntryDetail);
  if (editBtn) editBtn.addEventListener('click', handleEditClick);
  if (deleteBtn) deleteBtn.addEventListener('click', showDeleteConfirmation);
  if (cancelDelete) cancelDelete.addEventListener('click', hideDeleteConfirmation);
  if (confirmDelete) confirmDelete.addEventListener('click', handleDeleteConfirmation);
  if (searchInput) searchInput.addEventListener('input', filterEntries);
  if (moodFilter) moodFilter.addEventListener('change', filterEntries);
  if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
}

function handleScroll() {
  const currentScrollPosition = window.scrollY;
  const bottomNav = document.querySelector('.bottom-nav');
  const fab = document.querySelector('.fab');
  
  // Clear any existing timeout
  clearTimeout(scrollTimeout);
  
  // Determine scroll direction
  isScrollingDown = currentScrollPosition > lastScrollPosition;
  
  // Only trigger if we've scrolled more than 5px to prevent jitter
  if (Math.abs(currentScrollPosition - lastScrollPosition) > 5) {
    if (isScrollingDown && currentScrollPosition > 100) {
      // Scrolling down - hide both nav and FAB
      bottomNav.classList.add('hide');
      bottomNav.classList.remove('show');
      if (fab) {
        fab.classList.add('hide');
        fab.classList.remove('show');
      }
    } else {
      // Scrolling up - show both nav and FAB
      bottomNav.classList.add('show');
      bottomNav.classList.remove('hide');
      if (fab) {
        fab.classList.add('show');
        fab.classList.remove('hide');
      }
    }
  }
  
  // Set a timeout to show both if scrolling stops
  scrollTimeout = setTimeout(() => {
    bottomNav.classList.add('show');
    bottomNav.classList.remove('hide');
    if (fab) {
      fab.classList.add('show');
      fab.classList.remove('hide');
    }
  }, 1000);
  
  lastScrollPosition = currentScrollPosition;
}


function setActivePage() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-link');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  bottomNavItems.forEach(item => {
    const itemPage = item.getAttribute('href');
    if (currentPage === itemPage || (currentPage === '' && itemPage === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function showEntryForm() {
  entryForm.classList.remove('hidden');
  document.getElementById('title').focus();
}

function hideEntryForm() {
  entryForm.classList.add('hidden');
  resetForm();
}

function resetForm() {
  journalForm.reset();
  document.getElementById('entry-id').value = '';
  formTitle.textContent = 'New Entry';
}

function handleFormSubmit(e) {
  e.preventDefault();
  const entryId = document.getElementById('entry-id').value;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const mood = document.getElementById('mood').value;
  if (entryId) {
    updateEntry(entryId, { title, content, mood });
  } else {
    addEntry({ title, content, mood });
  }
  hideEntryForm();
  if (journalEntries) {
    renderJournalEntries();
  }
}

function renderJournalEntries() {
  if (!journalEntries) return;
  // Remove all children except emptyState
  Array.from(journalEntries.children).forEach(child => {
    if (child !== emptyState) {
      journalEntries.removeChild(child);
    }
  });
  const entries = getEntries();
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedMood = moodFilter ? moodFilter.value : '';
  let filteredEntries = entries;
  if (searchTerm) {
    filteredEntries = filteredEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm)
    );
  }
  if (selectedMood) {
    filteredEntries = filteredEntries.filter(entry => entry.mood === selectedMood);
  }
  if (filteredEntries.length === 0) {
    emptyState.style.display = 'block';
    if (searchTerm || selectedMood) {
      emptyDescription.textContent = 'Try adjusting your search or filter';
    } else {
      emptyDescription.textContent = 'Click the + button to create your first entry';
    }
  } else {
    emptyState.style.display = 'none';
    filteredEntries.forEach(entry => {
      const entryCard = createEntryCard(entry);
      journalEntries.appendChild(entryCard);
    });
  }
}

function createEntryCard(entry) {
  const card = document.createElement('div');
  card.className = `bento-card journal-card card-${entry.mood}`;
  card.dataset.id = entry.id;
  const formattedDate = formatDate(entry.timestamp);
  const excerpt = entry.content.length > 100 
    ? entry.content.substring(0, 100) + '...' 
    : entry.content;
  card.innerHTML = `
    <h3>${entry.title}</h3>
    <div class="journal-meta">
      <span>${formattedDate}</span>
      <span class="entry-mood mood-${entry.mood}">${capitalizeFirstLetter(entry.mood)}</span>
    </div>
    <div class="journal-excerpt">${excerpt}</div>
  `;
  card.addEventListener('click', () => showEntryDetail(entry.id));
  return card;
}

function showEntryDetail(id) {
  const entry = getEntries().find(entry => entry.id === id);
  if (!entry) return;
  document.getElementById('detail-title').textContent = entry.title;
  document.getElementById('detail-date').textContent = formatDate(entry.timestamp, true);
  document.getElementById('detail-mood').textContent = capitalizeFirstLetter(entry.mood);
  document.getElementById('detail-mood').className = `entry-mood mood-${entry.mood}`;
  document.getElementById('detail-content').textContent = entry.content;
  entryDetail.dataset.id = id;
  entryDetail.classList.add('visible');
}

function hideEntryDetail() {
  entryDetail.classList.remove('visible');
}

function handleEditClick() {
  const id = entryDetail.dataset.id;
  const entry = getEntries().find(entry => entry.id === id);
  if (!entry) return;
  document.getElementById('entry-id').value = id;
  document.getElementById('title').value = entry.title;
  document.getElementById('content').value = entry.content;
  document.getElementById('mood').value = entry.mood;
  formTitle.textContent = 'Edit Entry';
  hideEntryDetail();
  showEntryForm();
}

function showDeleteConfirmation() {
  confirmModal.classList.add('visible');
}

function hideDeleteConfirmation() {
  confirmModal.classList.remove('visible');
}

function handleDeleteConfirmation() {
  const id = entryDetail.dataset.id;
  deleteEntry(id);
  hideDeleteConfirmation();
  hideEntryDetail();
  if (journalEntries) {
    renderJournalEntries();
  }
}

function filterEntries() {
  renderJournalEntries();
}

function formatDate(date, includeTime = false) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(date).toLocaleDateString(undefined, options);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 