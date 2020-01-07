import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// Nota: Por alguna extraña razón no podemos usar aquí el services.index.ts
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService,
               private _router: Router )
  {}

  canActivate(): boolean
  {
    if ( this._usuarioService.estaLogueado() )
    {
      console.log("¡Paso por el Login Guard!");
      return true;
    }
    else
    {
      console.log("Bloqueado por el Guard!");
      this._router.navigate(['/login']);
      return false;
    }

  }
  
}
