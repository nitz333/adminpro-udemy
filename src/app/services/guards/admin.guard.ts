import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService ){}

  canActivate()
  {
    if ( this._usuarioService.usuario.role === 'ADMIN_ROLE' )
    {
      //console.log("¡Permitido por el Admin Guard!");
      return true;
    }
    else
    {
      console.log("¡Bloqueado por el Admin Guard!");
      this._usuarioService.logout();
      return false;
    }
  }
  
}
