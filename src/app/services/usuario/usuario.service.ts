import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_BACKEND } from '../../config/config';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Propiedades para saber si ya tenemos una sesión de usuario
  usuario: Usuario;
  token: string;

  constructor( private _http: HttpClient,
               private _router: Router )
  {
    this._cargarStorage();
  }

  login( usuario: Usuario, recordar: boolean = false )
  {
    if ( recordar )
    {
      // Lo único que hará el 'recordar' es almacenar el email, no importa si esta bien escrito o si existe
      // Nota: el password no lo guardaremos ya que la información del local storage no se almacena cifrada o segura
      localStorage.setItem('email', usuario.email);
    }
    else
    {
      // En este caso borraremos lo que haya en el item email del local storage, sino existe el item no pasa nada
      localStorage.removeItem('email');
    }

    let url = URL_BACKEND + '/login';
    
    return this._http.post( url, usuario ).pipe( map( (resp: any) => {
      
      // Guardaremos la información en el localStorage
      this._guardarStorage( resp.id, resp.token, resp.usuario );

      // Ya solo le diremos al usuario si se autentico en vez de pasarle datos que al fin ya obtuvimos e hicimos lo importante
      return true;

    })); 
  }

  loginGoogle( token: string )
  {
    let url = URL_BACKEND + '/login/google';

    // Nota: Es un post y nuestro backend requiere un objeto, por eso el token se envía como parte de un objeto.
    //       Y como en ES6 { atributo: atributo } es equivalente a { atributo }.
    return this._http.post( url, { token } ).pipe( map( (resp: any) => {
      // Guardaremos la información en el localStorage
      this._guardarStorage( resp.id, resp.token, resp.usuario );

      // Ya solo le diremos al usuario si se autentico en vez de pasarle datos que al fin ya obtuvimos e hicimos lo importante
      return true;
    }));
  }

  logout()
  {
    this.usuario = null;
    this.token = '';

    // Nota: No usaremo clear ya que eso borra todo lo que tenga almacenado en el dominio y los ajustes del
    //       usuario es algo que me gustaría conservar aún tras un logout (por el momento ya que estos no viven en la BD).
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('id');

    this._router.navigate(['/login']);
  }

  crearUsuario( usuario: Usuario )
  {
    
    let url = URL_BACKEND + '/usuario';
    
    return this._http.post( url, usuario ).pipe( map( (resp: any) => {
        // El hecho de obtener una resp, indica que el usuario ha sido creado
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: usuario.email
        });
        return resp.usuario;
      })
    ); 

  }

  estaLogueado()
  {
    return ( this.token.length > 0 ) ? true : false;
  }

  private _guardarStorage( id: string, token: string, usuario: Usuario )
  {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Nota: la propiedad del id no la vamos a usar mucho
    this.usuario = usuario;
    this.token = token;

  }

  private _cargarStorage()
  {
    if ( localStorage.getItem('token') )
    {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    }
    else
    {
      this.token = '';
      this.usuario = null;
    }
  }
  

}
