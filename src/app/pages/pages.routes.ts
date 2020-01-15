import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import { LoginGuard, AdminGuard, TokenGuard } from '../services/services.index';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


const routes: Routes = [
          {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [ TokenGuard ], // Este guard puede ponerse en todas aquellas páginas que requieran de validar el token previamente. Para este proyecto solo lo dejaremos cada que se navegue al dashboard.
            data: { titulo: 'Dashboard' }
          },
          { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
          { path: 'grafica1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
          { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
          { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
          { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del tema' } },
          { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil del usuario' } },
          { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' } },
          // Menú de 'Mantenimiento'
          { 
            path: 'usuarios',
            component: UsuariosComponent,
            canActivate: [ AdminGuard ],
            data: { titulo: 'Mantenimiento de usuarios' }
          },
          { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de hospitales' } },
          { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de médicos' } },
          { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar médico' } },
          
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Cualquier ruta vacía redirecciona al dashboard
];

export const PAGES_ROUTES = RouterModule.forChild( routes );