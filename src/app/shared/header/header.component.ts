import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  // Solo para que no tengamos que escribir tanto en el html y se vea más limpio.
  usuario: Usuario;

  constructor( public usuarioService: UsuarioService ) { }

  ngOnInit()
  {
    this.usuario = this.usuarioService.usuario;
  }

}
