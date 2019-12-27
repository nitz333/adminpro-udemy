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


// temporales, se van a rehubicar más tarde:
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
