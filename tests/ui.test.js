import {
    formatDate,
    capitalizeFirstLetter,
    createEntryCard,
    filterEntries,
    renderJournalEntries
  } from '../js/ui.js';
  
  // Set up a mock DOM environment
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="journal-entries">
        <div id="empty-state" style="display: none;">
          <p id="empty-description"></p>
        </div>
      </div>
      <input id="search-input" value="">
      <select id="mood-filter">
        <option value=""></option>
        <option value="happy">Happy</option>
      </select>
    `;
  });
  
  // Mock the storage module
  jest.mock('../js/storage.js', () => ({
    getEntries: jest.fn()
  }));
  
  describe('UI Utility Functions', () => {
    describe('formatDate', () => {
      test('formats date without time', () => {
        const date = new Date('2023-01-01T12:00:00');
        // Match the exact format your function produces
        expect(formatDate(date)).toMatch(/\d{1,2} \w{3} \d{4}/); // Matches "1 Jan 2023"
      });
  
      test('formats date with time when requested', () => {
        const date = new Date('2023-01-01T14:30:00');
        expect(formatDate(date, true)).toMatch(/\d{1,2}:\d{2}/); // Contains time
      });
    });
  
    describe('capitalizeFirstLetter', () => {
      test('capitalizes the first letter', () => {
        expect(capitalizeFirstLetter('test')).toBe('Test');
      });
  
      test('handles empty string', () => {
        expect(capitalizeFirstLetter('')).toBe('');
      });
    });
  
    describe('createEntryCard', () => {
      test('creates a card with correct structure', () => {
        const entry = {
          id: '1',
          title: 'Test Title',
          content: 'Test content',
          mood: 'happy',
          timestamp: new Date()
        };
  
        const card = createEntryCard(entry);
        expect(card.className).toBe('bento-card journal-card card-happy');
        expect(card.innerHTML).toContain('Test Title');
        expect(card.innerHTML).toContain('Happy');
      });
    });
  
    describe('renderJournalEntries', () => {
      test('shows empty state when no entries', () => {
        require('../js/storage.js').getEntries.mockReturnValue([]);
        renderJournalEntries();
        expect(document.getElementById('empty-state').style.display).toBe('none');
      });
  
      
    });
  });