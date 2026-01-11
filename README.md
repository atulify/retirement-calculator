# Retirement Calculator

A modern web application for planning your financial future by calculating retirement savings projections and monthly income estimates.

## Overview

This Retirement Calculator helps users visualize their retirement savings growth over time based on their current financial situation and assumptions. The app provides interactive charts and projections to help plan for retirement.

## Features

- **Financial Input Form**: Enter your current age, retirement savings, expected rate of return (IRR), and desired retirement age
- **Growth Projections**: Visualize how your savings will grow over time up to age 100
- **Monthly Income Estimates**: Calculate estimated monthly retirement income based on withdrawal rates
- **Interactive Charts**: Dynamic charts using Recharts to visualize retirement projections
- **Adjustable Parameters**: Modify the expected rate of return on the results page to see different scenarios

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable React components
│   ├── InputForm.jsx
│   ├── MonthlyIncome.jsx
│   └── RetirementChart.jsx
├── pages/          # Page components
│   ├── LandingPage.jsx
│   └── ResultsPage.jsx
├── utils/          # Utility functions
│   └── calculations.js
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

## How It Works

1. Enter your financial information on the landing page (current age, savings, expected rate of return, and retirement age)
2. View projections on the results page, including:
   - A chart showing savings growth over time
   - Monthly income estimates at retirement
   - Ability to adjust the rate of return to see different scenarios
