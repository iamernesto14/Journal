# Mindful Journal

Mindful Journal is a simple, elegant, and privacy-focused journaling web application. It allows users to record daily thoughts, track moods, and visualize their emotional well-being over time—all while keeping data stored locally on the user's device.

## Features

- **Journaling:** Create, edit, and delete daily journal entries with mood selection.
- **Mood Tracking:** Assign moods (Happy, Sad, Motivated, Stressed, Relaxed) to each entry.
- **Statistics Dashboard:** Visualize your journaling streak, total entries, first entry date, 7-day activity, and mood distribution with beautiful charts.
- **Search & Filter:** Quickly find entries by keyword or mood.
- **Data Export:** Export all journal entries as a CSV file.
- **Theme Support:** Toggle between light and dark modes.
- **Mobile Friendly:** Responsive design with mobile navigation and touch-friendly UI.
- **Privacy First:** All data is stored locally in your browser; nothing is sent to any server.

## Demo

![Mindful Journal Screenshot](https://api.pikwy.com/web/681dc7ae5450033603360b64.jpg)
## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts & Tooling](#scripts--tooling)
- [Testing](#testing)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Prerequisites

- Node.js (for running tests and development tooling)
- A modern web browser (for using the app)

### Running the App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamernesto14/Journal.git
   cd Alma
   ```

2. **Open `index.html` in your browser:**
   - No build step is required for basic usage.
   - All data is stored in your browser's localStorage.

3. **(Optional) Install dependencies for testing:**
   ```bash
   npm install
   ```

---

## Project Structure

```
.
├── index.html           # Home page
├── journal.html         # Journal entry page
├── statistics.html      # Statistics dashboard
├── about.html           # About & privacy info
├── css/
│   └── styles.css       # Main stylesheet
├── js/
│   ├── script.js        # Entry point, initializes UI
│   ├── ui.js            # All DOM and UI logic
│   ├── journal.js       # Journal entry logic (CRUD, export, streaks)
│   ├── statistics.js    # Statistics and chart rendering
│   └── storage.js       # LocalStorage operations
├── tests/
│   ├── ui.test.js
│   ├── journal.test.js
│   ├── statistics.test.js
│   └── storage.test.js
├── package.json
├── jest.config.js
└── .babelrc
```

### Key Files

- **`index.html`**: Landing page with app introduction and navigation.
- **`journal.html`**: Main journaling interface (add, edit, view, delete entries).
- **`statistics.html`**: Dashboard with streak, entry count, and charts (uses [Chart.js](https://www.chartjs.org/)).
- **`about.html`**: App purpose, usage instructions, and privacy notice.
- **`js/ui.js`**: Handles all UI interactions, event listeners, and DOM updates.
- **`js/journal.js`**: Core logic for managing journal entries, including streak calculation and CSV export.
- **`js/statistics.js`**: Renders statistics and charts based on journal data.
- **`js/storage.js`**: Abstracts localStorage access for journal entries.

---

## Scripts & Tooling

### NPM Scripts

- `npm test` — Runs all tests using [Jest](https://jestjs.io/).
- `npm run test:watch` — Runs tests in watch mode.

### Tooling

- **Jest**: For unit testing all modules.
- **Babel**: For ES6+ compatibility in tests (`@babel/preset-env`).
- **Chart.js**: For rendering statistics charts (loaded via CDN in HTML).

---

## Testing

All core modules are covered by unit tests in the `tests/` directory.

- **UI Tests** (`ui.test.js`): Test DOM manipulation, rendering, and utility functions.
- **Journal Logic** (`journal.test.js`): Test CRUD operations, streak calculation, and data export.
- **Statistics** (`statistics.test.js`): Test statistics calculations and DOM updates.
- **Storage** (`storage.test.js`): Test localStorage read/write and data parsing.

To run all tests:
```bash
npm test
```

---

## Customization

- **Themes:** Easily switch between light and dark mode using the theme toggle button.
- **Moods:** You can add more moods by updating the mood options in the HTML and CSS variables in `styles.css`.
- **Charts:** Chart.js options can be customized in `js/statistics.js`.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests on [GitHub](https://github.com/iamernesto14/Journal).

---

## License

This project is licensed under the [ISC License](LICENSE).

---

## Privacy

Your journal entries are **never** sent to any server. All data is stored locally in your browser's localStorage. Clearing your browser data will delete your journal.

---

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for charting.
- [Google Fonts (Lato)](https://fonts.google.com/specimen/Lato) for typography.

---

**Enjoy your mindful journaling journey!** 