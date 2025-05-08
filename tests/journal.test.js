import { addEntry, updateEntry, deleteEntry, calculateCurrentStreak } from '../js/journal.js';
import { getEntries, saveEntries } from '../js/storage.js';

// Mock the storage module
jest.mock('../js/storage.js');

describe('Journal Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getEntries.mockReturnValue([]);
  });

  describe('addEntry', () => {
    test('adds a new entry with generated id and timestamp', () => {
      const mockEntry = { title: 'Test', content: 'Content', mood: 'happy' };
      
      addEntry(mockEntry);
      
      expect(getEntries).toHaveBeenCalled();
      expect(saveEntries).toHaveBeenCalled();
      
      const savedEntries = saveEntries.mock.calls[0][0];
      expect(savedEntries).toHaveLength(1);
      expect(savedEntries[0]).toMatchObject({
        title: 'Test',
        content: 'Content',
        mood: 'happy'
      });
      expect(savedEntries[0].id).toBeDefined();
      expect(savedEntries[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('updateEntry', () => {
    test('updates an existing entry', () => {
      const existingEntry = {
        id: '123',
        title: 'Old Title',
        content: 'Old Content',
        mood: 'sad',
        timestamp: new Date('2023-01-01')
      };
      getEntries.mockReturnValue([existingEntry]);
      
      updateEntry('123', {
        title: 'New Title',
        content: 'New Content',
        mood: 'happy'
      });
      
      const savedEntries = saveEntries.mock.calls[0][0];
      expect(savedEntries).toHaveLength(1);
      expect(savedEntries[0]).toMatchObject({
        id: '123',
        title: 'New Title',
        content: 'New Content',
        mood: 'happy'
      });
      expect(savedEntries[0].timestamp.getTime()).toBeGreaterThan(existingEntry.timestamp.getTime());
    });

    test('does nothing if entry not found', () => {
      getEntries.mockReturnValue([]);
      
      updateEntry('123', {
        title: 'New Title',
        content: 'New Content',
        mood: 'happy'
      });
      
      expect(saveEntries).not.toHaveBeenCalled();
    });
  });

  describe('deleteEntry', () => {
    test('deletes an existing entry', () => {
      const entry1 = { id: '1', title: 'Keep Me' };
      const entry2 = { id: '2', title: 'Delete Me' };
      getEntries.mockReturnValue([entry1, entry2]);
      
      deleteEntry('2');
      
      const savedEntries = saveEntries.mock.calls[0][0];
      expect(savedEntries).toHaveLength(1);
      expect(savedEntries[0]).toEqual(entry1);
    });
  });

  describe('calculateCurrentStreak', () => {
    test('returns 0 for no entries', () => {
      expect(calculateCurrentStreak([])).toBe(0);
    });

    test('returns 1 for single entry today', () => {
      const today = new Date();
      const entries = [{ timestamp: today }];
      expect(calculateCurrentStreak(entries)).toBe(1);
    });

    test('returns streak for consecutive days', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBefore = new Date(yesterday);
      dayBefore.setDate(dayBefore.getDate() - 1);
      
      const entries = [
        { timestamp: dayBefore },
        { timestamp: yesterday },
        { timestamp: today }
      ];
      
      expect(calculateCurrentStreak(entries)).toBe(3);
    });

    test('breaks streak for missing day', () => {
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const entries = [
        { timestamp: twoDaysAgo },
        { timestamp: today }
      ];
      
      expect(calculateCurrentStreak(entries)).toBe(1);
    });
  });
});