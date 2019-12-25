import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { Error404Component } from './shared/error404/error404.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: Error404Component } // Cualquier ruta que no esté definida aquí mandará a error 404
];

export const APP_ROUTES = RouterModule.forRoot( routes, { useHash: true } );
