// journal.js
// Handles journal entry logic and statistics
import { getEntries, saveEntries } from './storage.js';

// Add a new entry
export function addEntry(entry) {
  const entries = getEntries();
  const newEntry = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...entry
  };
  entries.unshift(newEntry);
  saveEntries(entries);
}

// Update an existing entry
export function updateEntry(id, updatedEntry) {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    entries[index] = {
      ...entries[index],
      ...updatedEntry,
      timestamp: new Date()
    };
    saveEntries(entries);
  }
}

// Delete an entry
export function deleteEntry(id) {
  const entries = getEntries().filter(entry => entry.id !== id);
  saveEntries(entries);
}

// Export journal data as CSV
export function exportData() {
  const entries = getEntries();
  if (entries.length === 0) {
    alert('No journal entries to export');
    return;
  }
  const csvHeader = ['ID', 'Title', 'Content', 'Mood', 'Timestamp'].join(',');
  const csvRows = entries.map(entry => [
    entry.id,
    `"${entry.title.replace(/"/g, '""')}"`,
    `"${entry.content.replace(/"/g, '""')}"`,
    entry.mood,
    new Date(entry.timestamp).toISOString()
  ].join(','));
  const csvContent = [csvHeader, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().split('T')[0];
  const filename = `journal_export_${today}.csv`;
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

