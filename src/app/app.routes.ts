import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'v',
    loadComponent: () => import('./features/volunteering/volunteering').then((m) => m.Volunteering),
  },
  {
    path: 'volunteer',
    loadComponent: () => import('./features/volunteers/volunteer').then((m) => m.Volunteer),
    children: [
      { path: '', redirectTo: 'allvolunteers', pathMatch: 'full' },
      {
        path: 'allvolunteers',
        loadComponent: () =>
          import('./features/volunteers/all-volunteers/all-volunteers').then((m) => m.AllVolunteers),
        children: [
          {
            path: 'volunteer-details',
            loadComponent: () =>
              import('./features/volunteers/volunteer-details/volunteer-details').then(
                (m) => m.VolunteerDetails,
              ),
          },
        ],
      },
      {
        path: 'addvolunteer/add',
        loadComponent: () =>
          import('./features/volunteers/add-volunteer/add-volunteer').then((m) => m.AddVolunteer),
      },
      {
        path: 'addvolunteer/edit/:id',
        loadComponent: () =>
          import('./features/volunteers/add-volunteer/add-volunteer').then((m) => m.AddVolunteer),
      },
    ],
  },
  {
    path: 'project',
    loadComponent: () => import('./features/projects/project/project').then((m) => m.Project),
  },
  {
    path: 'eichud',
    loadComponent: () => import('./features/eichud/eichud').then((m) => m.Eichud),
  },
  {
    path: 'position',
    loadComponent: () => import('./features/positions/position').then((m) => m.Position),
  },
  {
    path: 'midData/:code',
    loadComponent: () => import('./features/analytics/mid-data/mid-data').then((m) => m.MidData),
  },
  {
    path: 'deepDataDisplay/:code',
    loadComponent: () =>
      import('./features/analytics/deep-data-display/deep-data-display').then(
        (m) => m.DeepDataDisplay,
      ),
  },
  {
    path: 'data',
    loadComponent: () =>
      import('./features/analytics/data-display/data-display').then((m) => m.DataDisplay),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/log-in').then((m) => m.LogIn),
  },
  {
    path: 'domain',
    loadComponent: () => import('./features/projects/domains/domains').then((m) => m.Domains),
    children: [
      {
        path: 'project',
        loadComponent: () => import('./features/projects/project/project').then((m) => m.Project),
      },
      {
        path: 'sub/:id/:name',
        loadComponent: () =>
          import('./features/projects/sub-project/sub-project').then((m) => m.SubProject),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
