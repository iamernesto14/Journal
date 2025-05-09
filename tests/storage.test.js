import { getEntries, saveEntries } from '../js/storage.js';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Storage Module', () => {
  test('getEntries returns empty array when localStorage is empty', () => {
    expect(getEntries()).toEqual([]);
  });

  test('getEntries parses stored entries correctly', () => {
    const testData = [
      { id: '1', title: 'Test', timestamp: '2023-01-01T00:00:00Z' }
    ];
    localStorage.setItem('journal-entries', JSON.stringify(testData));
    
    const entries = getEntries();
    expect(entries[0].timestamp).toBeInstanceOf(Date);
    expect(entries[0].title).toBe('Test');
  });
});