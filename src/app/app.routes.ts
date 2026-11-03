import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./Components/home-page/home-page').then(m => m.HomePage) },
    { path: 'v', loadComponent: () => import('./Components/volunteering/volunteering').then(m => m.Volunteering) },

    {
        path: 'volunteer', loadComponent: () => import('./Components/volunteer/volunteer').then(m => m.Volunteer), children: [
            { path: '', redirectTo: 'allvolunteers', pathMatch: 'full' },
            {
                path: 'allvolunteers', loadComponent: () => import('./Components/volunteer/all-volunteers/all-volunteers').then(m => m.AllVolunteers), children: [
                    { path: 'volunteer-details', loadComponent: () => import('./Components/volunteer/volunteer-details/volunteer-details').then(m => m.VolunteerDetails) }
                ]
            },
            {
                path: 'addvolunteer/add',
                loadComponent: () => import('./Components/volunteer/add-volunteer/add-volunteer').then(m => m.AddVolunteer)
            },
            {
                path: 'addvolunteer/edit/:id',
                loadComponent: () => import('./Components/volunteer/add-volunteer/add-volunteer').then(m => m.AddVolunteer)
            }

        ]
    },
    { path: 'project', loadComponent: () => import('./Components/project/project').then(m => m.Project) },
    { path: 'eichud', loadComponent: () => import('./Components/eicud/eicud').then(m => m.Eicud) },
    { path: 'position', loadComponent: () => import('./Components/position/position').then(m => m.Position) },
    { path: '', loadComponent: () => import('./Components/home-page/home-page').then(m => m.HomePage) },
    { path: 'midData/:code', loadComponent: () => import('./Components/mid-data/mid-data').then(m => m.MidData) },
    { path: 'deepDataDisplay/:code', loadComponent: () => import('./Components/deep-data-display/deep-data-display').then(m => m.DeepDataDisplay) },



    { path: 'data', loadComponent: () => import('./Components/data-display/data-display').then(m => m.DataDisplay) },


    { path: 'login', loadComponent: () => import('./Components/log-in/log-in').then(m => m.LogIn) },
    {
        path: 'domain', loadComponent: () => import('./Components/domains/domains').then(m => m.Domains),
        children: [
            { path: 'project', loadComponent: () => import('./Components/project/project').then(m => m.Project) },
            { path: 'sub/:id/:name', loadComponent: () => import('./Components/sub-project/sub-project').then(m => m.SubProject) },
        ]
    }

];
