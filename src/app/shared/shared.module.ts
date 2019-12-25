import { NgModule } from "@angular/core";

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { Error404Component } from './error404/error404.component';


@NgModule({
    declarations: [
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        Error404Component
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        Error404Component
    ]
})
export class SharedModule {}