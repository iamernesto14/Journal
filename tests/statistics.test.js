import { updateStreakCount, updateTotalEntries } from '../js/statistics.js';
import { calculateCurrentStreak } from '../js/journal.js';

jest.mock('../js/journal.js');
jest.mock('../js/storage.js');

describe('Statistics Module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="current-streak"></div>
      <div id="streak-message"></div>
      <div id="total-entries"></div>
      <div id="first-entry"></div>
    `;
  });

  test('updateStreakCount displays correct streak', () => {
    calculateCurrentStreak.mockReturnValue(3);
    updateStreakCount([]);
    
    expect(document.getElementById('current-streak').textContent).toBe('3');
    expect(document.getElementById('streak-message').textContent)
      .toContain('Keep the momentum');
  });

  test('updateTotalEntries shows oldest entry date', () => {
    const entries = [
      { id: '1', title: 'Oldest', timestamp: new Date('2023-01-01') },
      { id: '2', title: 'Newer', timestamp: new Date('2023-01-02') }
    ];
    
    updateTotalEntries(entries);
    expect(document.getElementById('first-entry').textContent)
      .toContain('1 Jan 2023');
  });
});