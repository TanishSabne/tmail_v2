# Project Title

A modern React-based web application built using **Vite** for blazing-fast development and optimized production builds. This project demonstrates a modular architecture, clean code practices, and production-ready deployment configurations, making it ideal for scalable web development.

---

## Features

### 1. **Dynamic Email Utilities**
- Temporary email address generation and management.
- Rich mail card display and content rendering.
- Quick-copy email addresses and seamless content view.

### 2. **Responsive UI & Accessibility**
- Built with **Bootstrap** and **React-Bootstrap** for responsive layouts.
- Font Awesome integration for consistent iconography.
- Accessible error and success toasts for user feedback.

### 3. **Robust Error & Offline Handling**
- **ErrorBoundary** component for graceful error fallbacks.
- **OfflineIndicator** to notify users when the network connection drops.

### 4. **Custom Hooks & Utilities**
- `useAutoRefresh` – Automatically refreshes content at specified intervals.
- `useLocalStorage` – Persistent state management using browser storage.
- Utility modules (`apiService`, `cookieManager`, `helpers`) for cleaner and reusable code.

### 5. **Production-Ready Configuration**
- **Vite** build tool for lightning-fast HMR and optimized builds.
- **Netlify configuration** (`netlify.toml`) for smooth deployment.
- **ESLint setup** to enforce code quality.
- **Vitest integration** for efficient unit testing.

---

## Tech Stack & Libraries

### Core
- **React** `^19.1.0` – UI library.
- **React DOM** – DOM rendering for React.

### Networking & APIs
- **Axios** `^1.10.0` – HTTP client for API requests.

### Styling & Components
- **Bootstrap** `^5.3.7` – Base styling and grid system.
- **React-Bootstrap** `^2.10.10` – React components for Bootstrap.
- **Font Awesome** – Icons (`@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`).

### Development & Tooling
- **Vite** `^7.0.0` – Build tool and development server.
- **@vitejs/plugin-react** – React integration for Vite.
- **ESLint** `^9.29.0` – Code linting.
- **Vitest** – Testing framework.
- **Terser** – Minification for production builds.

---

## Project Structure
```
project/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── layout/         # OfflineIndicator, ErrorBoundary
│   │   ├── email/          # Email-related components
│   │   └── ui/             # Toasts, alerts, spinners
│   ├── hooks/              # Custom hooks (useAutoRefresh, useLocalStorage)
│   ├── utils/              # Helper modules (apiService, cookieManager)
│   ├── config/             # Constants and configurations
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── vite.config.js          # Vite configuration
├── vitest.config.js        # Vitest configuration
├── netlify.toml            # Netlify deployment configuration
└── package.json            # Project dependencies & scripts
```

---

## Getting Started

### Prerequisites
- **Node.js** `>= 18`
- **npm** or **yarn** package manager

### Installation
```bash
git clone <repository_url>
cd project
npm install
```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Create a production-ready build:
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Testing
Run unit tests with Vitest:
```bash
npm run test
```

---

## Deployment
This project is configured for **Netlify** deployment out-of-the-box:
1. Push your repository to GitHub/GitLab/Bitbucket.
2. Connect your repository on [Netlify](https://www.netlify.com/).
3. Set the build command to `npm run build` and the publish directory to `dist/`.

---

## Why This Project Stands Out
- Implements **modular architecture** with reusable components.
- Showcases **real-world production patterns** (error boundaries, offline handling, API abstraction).
- Fully **responsive and accessible**.
- Includes **testing and linting pipelines** for professional-grade development.

---

## License
This project is licensed under the MIT License – feel free to use and modify for educational and professional purposes.

