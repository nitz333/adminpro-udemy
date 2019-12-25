import { NgModule } from "@angular/core";

// Rutas hijas
import { PAGES_ROUTES } from './pages.routes';

// Mis módulos
import { SharedModule } from '../shared/shared.module';

// Mis componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    exports: [
        //PagesComponent, // Este componente es para este mismo módulo, se exporta explícitamente hasta abajo como definición de clase.
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES
    ]
})
export class PagesModule {}