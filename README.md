# GivingWithLove — Frontend

Angular web app for managing a charity organization: a responsive dashboard with volunteer management, projects and sub-projects, positions, and data visualizations.
Consumes the REST API in [GivingWithLove-backend](https://github.com/YaffiAdler/GivingWithLove-backend).

## Features
- Volunteer management — list, add, edit and view details
- Projects and sub-projects, volunteer domains, positions and volunteering records
- Dashboard with drill-down data views and charts
- Login screen and client-side routing with nested routes
- Responsive UI

## Tech stack
- Angular 20 (standalone components, Angular Router, HttpClient)
- TypeScript, SCSS
- Angular Material, PrimeNG, Bootstrap 5
- Chart.js with ng2-charts
- RxJS

## Project structure
```
src/app
├── Components   – screens: home, login, volunteer (list/add/details), project, sub-project, domains, position, data views
├── Models       – TypeScript models matching the API
├── Services     – HTTP services, one per API resource
├── app.routes.ts
└── app.config.ts
```

## Getting started
**Requirements:** Node.js (LTS) and npm; the backend running locally.

```bash
git clone https://github.com/YaffiAdler/GivingWithLove-frontend.git
cd GivingWithLove-frontend
npm install
npm start
```
Open `http://localhost:4200`.

The API base URL is currently `https://localhost:7016/api/...` and is set inside the files in `src/app/Services`.

## Scripts
| Command | Description |
|---|---|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Unit tests (Karma + Jasmine) |

## Roadmap
- Move the API URL to Angular environment files
- Route guards for authenticated pages
- Screenshots / demo deployment
