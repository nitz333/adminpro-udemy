import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

// Rutas hijas
import { PAGES_ROUTES } from './pages.routes';

// Mis módulos
import { SharedModule } from '../shared/shared.module';

// Módulos de terceros
import { ChartsModule } from 'ng2-charts';

// Mis componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';

// Temporales, se rehubicarán más adelante...
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent
    ],
    exports: [
        //PagesComponent, // Este componente es para este mismo módulo, se exporta explícitamente hasta abajo como definición de clase.
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule
    ]
})
export class PagesModule {}