// statistics.js
// Handles statistics and chart logic for the journal app
import { getEntries } from './storage.js';
import { calculateCurrentStreak } from './journal.js';

export function initializeStatistics() {
  const entries = getEntries();
  updateStreakCount(entries);
  updateTotalEntries(entries);
  renderWeeklyChart(entries);
  renderMoodChart(entries);
}

export function updateStreakCount(entries) {
  const streakCountEl = document.getElementById('current-streak');
  const streakMessageEl = document.getElementById('streak-message');
  if (!streakCountEl || !streakMessageEl) return;
  const streak = calculateCurrentStreak(entries);
  streakCountEl.textContent = streak;
  if (streak > 0) {
    streakMessageEl.textContent = 'Keep the momentum going!';
  } else {
    streakMessageEl.textContent = 'Start your streak today!';
  }
}

export function updateTotalEntries(entries) {
  const totalEntriesEl = document.getElementById('total-entries');
  const firstEntryEl = document.getElementById('first-entry');
  if (!totalEntriesEl || !firstEntryEl) return;
  totalEntriesEl.textContent = entries.length;
  if (entries.length > 0) {
    const oldestEntry = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
    firstEntryEl.textContent = `First entry: ${formatDate(oldestEntry.timestamp)}`;
  } else {
    firstEntryEl.textContent = 'No entries yet';
  }
}

export function renderWeeklyChart(entries) {
  const weekChartEl = document.getElementById('week-chart');
  if (!weekChartEl) return;
  const days = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dateKey = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= date && entryDate < nextDate;
    });
    days.push(dayName);
    counts.push(dayEntries.length);
  }
  const ctx = weekChartEl.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Entries',
        data: counts,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

export function renderMoodChart(entries) {
  const moodChartEl = document.getElementById('mood-chart');
  const noMoodDataEl = document.getElementById('no-mood-data');
  if (!moodChartEl || !noMoodDataEl) return;
  const moodCounts = {};
  entries.forEach(entry => {
    if (!moodCounts[entry.mood]) {
      moodCounts[entry.mood] = 0;
    }
    moodCounts[entry.mood]++;
  });
  const moods = Object.keys(moodCounts);
  if (moods.length === 0) {
    noMoodDataEl.style.display = 'flex';
    return;
  }
  noMoodDataEl.style.display = 'none';
  const moodColors = {
    happy: getComputedStyle(document.documentElement).getPropertyValue('--happy').trim(),
    sad: getComputedStyle(document.documentElement).getPropertyValue('--sad').trim(),
    motivated: getComputedStyle(document.documentElement).getPropertyValue('--motivated').trim(),
    stressed: getComputedStyle(document.documentElement).getPropertyValue('--stressed').trim(),
    relaxed: getComputedStyle(document.documentElement).getPropertyValue('--relaxed').trim()
  };
  const colors = moods.map(mood => `hsl(${moodColors[mood]})`);
  const ctx = moodChartEl.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: moods.map(capitalizeFirstLetter),
      datasets: [{
        data: moods.map(mood => moodCounts[mood]),
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
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