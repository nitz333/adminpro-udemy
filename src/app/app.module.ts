import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas raíces
import { APP_ROUTES } from './app.routes';

// Mis módulos
import { PagesModule } from './pages/pages.module';

// Mis componentes
import { AppComponent } from './app.component';
import { RegisterComponent } from './login/register.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
