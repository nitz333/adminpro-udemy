import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';


const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'progress', component: ProgressComponent },
          { path: 'grafica1', component: Graficas1Component },
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Cualquier ruta vacía redirecciona al dashboard
        ]
      }
];

export const PAGES_ROUTES = RouterModule.forChild( routes );