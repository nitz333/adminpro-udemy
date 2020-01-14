import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  // Solo para que no tengamos que escribir tanto en el html y se vea más limpio.
  usuario: Usuario;
  
  constructor( public sidebarService: SidebarService,
               public usuarioService: UsuarioService ) { }

  ngOnInit()
  {
    this.usuario = this.usuarioService.usuario;
    this.sidebarService.cargarMenu();
  }

}
