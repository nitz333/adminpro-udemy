import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService,
               private _router: Router ){}

  canActivate(): Promise<boolean> | boolean
  {
    let token = this._usuarioService.token;

    // Necesitamos obtener la fecha de expiración del token; este token fue generado en el backend con
    // JWT, esta librería crea tokens a través de la codificación de un string en base64. Para recuperar
    // esa información:
    // Nota: Puede verse información sobre atob en https://developer.mozilla.org/es/docs/Web/API/WindowBase64/atob
    let payload = JSON.parse( atob( token.split('.')[1] ) );
    //console.log(payload);
    let expirado = this.haExpirado( payload.exp );

    if ( expirado )
    {
      this._router.navigate(['/login']);
      // CanActivate debe entonces impedir el acceso y aquí es donde canActivate devuelve un boolean.
      // Nota: De momento todo este proceso de validación se ha hecho de manera síncrona.
      return false;
    }

    // Renovamos el token solo en caso de ser necesario
    // Nota: Aquí es donde el proceso para renovarlo puede ser asíncrono y aquí es donde canActivate devuelve una promesa.
    return this.verificaRenueva( payload.exp );
  }

  haExpirado( segExp: number )
  {
    // Vamos a comparar el parámetro segExp (tiempo en segundos para expiración del token) con los segundos de la fecha actual:
    let segAhora = new Date().getTime() / 1000;

    if ( segExp < segAhora )
    {
      return true; // El token ha expirado
    }
    else
    {
      return false;
    }
  }

  verificaRenueva( segExp: number ): Promise<boolean>
  {
    return new Promise( (resolve, reject) => {

      // Primero traemos los segundos para expiración del token a segundos de una fecha actual
      let tokenExp = new Date( segExp * 1000 );

      // Tip: Es recomendable obtener la fecha desde una BD ya que Date() pertenece a JavaScript y este vive en
      //      el navegador, por lo que un usuario podría modificar la fecha de su sistema. Pero en este ejemplo no lo haremos:
      let ahora = new Date();
      // Supongamos que quiero verificar que falta una hora para que expire el token
      // Nota: Dado que el token en el backend se establece para 4 horas, si se quisiera siempre actualizar este token
      //       debería de multiplicarse por 4 en vez de uno.
      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) ); // El 1 es para una hora
      //console.log(tokenExp);
      //console.log(ahora);

      // Si la fecha del token aún es mayor que la fecha actual e incrementada,
      // no renovamos el token y simplemente resolvemos true
      if ( tokenExp.getTime() > ahora.getTime() )
      {
        resolve(true);
      }
      else
      {
        // El token ya esta en el intervalo de vencimiento, debemos renovarlo
        this._usuarioService.renuevaToken().subscribe( () => {
          resolve(true);
        },
        () => {
          this._router.navigate(['/login']);
          reject(false);
        });
      }
      
    });


  }
  
}
