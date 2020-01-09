import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // Este menú será construido dinámicamente de acuerdo al perfil del usuario
  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Gráficas', url: '/grafica1' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'RxJs', url: '/rxjs' },
      ]
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url: '/usuarios' },
        { titulo: 'Hospitales', url: '/hospitales' },
        { titulo: 'Médicos', url: '/medicos' }
      ]
    }
  ];

  constructor() { }
}
