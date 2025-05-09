// Handles localStorage operations for journal entries

/**
 * Get all journal entries from local storage
 * @returns {JournalEntry[]}
 */
export function getEntries() {
    const entriesJson = localStorage.getItem('journal-entries');
    if (entriesJson) {
      try {
        const entries = JSON.parse(entriesJson);
        // Convert timestamp strings to Date objects
        return entries.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
      } catch (err) {
        console.error('Error parsing journal entries:', err);
        return [];
      }
    }
    return [];
  }
  
  /**
   * Save entries to local storage
   * @param {JournalEntry[]} entries
   */
  export function saveEntries(entries) {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  } 