import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_BACKEND } from '../../config/config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadService } from '../upload/upload.service'; // Esta bien de esta ruta y no del services.index.ts por el error cíclico raro.
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Propiedades para saber si ya tenemos una sesión de usuario
  id: string; // En nuestra app este id realemnte no es tan importante
  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor( private _http: HttpClient,
               private _router: Router,
               private _upload: UploadService )
  {
    this._cargarStorage();
    //console.log(this.usuario);
  }

  renuevaToken()
  {
    let url = URL_BACKEND + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this._http.get( url ).pipe( map( (resp: any) => {

      this.token = resp.token;

      // Guardaremos la información en el localStorage
      // Nota: No es necesario renovar el token de la BD, ya que nuestra app usa el del local storage
      this._guardarStorage( this.id, resp.token, this.usuario, this.menu );
      //console.log("Token renovado!");
      return true;
    }),
    catchError( err => {
      //console.log(err.status);
      this._router.navigate(['/login']);
      Swal.fire({
        icon: 'error',
        title: 'Error en la autenticación',
        text: "No fue posible renovar el token"
      });
      return throwError( err );
    }));
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
      this._guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );

      // Ya solo le diremos al usuario si se autentico en vez de pasarle datos que al fin ya obtuvimos e hicimos lo importante
      return true;

    }),
    catchError( err => {
      //console.log(err.status);
      Swal.fire({
        icon: 'error',
        title: 'Error en la autenticación',
        text: err.error.mensaje
      });
      return throwError( err );
    })); 
  }

  loginGoogle( token: string )
  {
    let url = URL_BACKEND + '/login/google';

    // Nota: Es un post y nuestro backend requiere un objeto, por eso el token se envía como parte de un objeto.
    //       Y como en ES6 { atributo: atributo } es equivalente a { atributo }.
    return this._http.post( url, { token } ).pipe( map( (resp: any) => {
      //console.log('logoogle',resp);
      // Guardaremos la información en el localStorage
      this._guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );

      // Ya solo le diremos al usuario si se autentico en vez de pasarle datos que al fin ya obtuvimos e hicimos lo importante
      return true;
    }));
  }

  logout()
  {
    this.id = '';
    this.usuario = null;
    this.token = '';
    this.menu = [];

    // Nota: No usaremo clear ya que eso borra todo lo que tenga almacenado en el dominio y los ajustes del
    //       usuario es algo que me gustaría conservar aún tras un logout (por el momento ya que estos no viven en la BD).
    localStorage.removeItem('id');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this._router.navigate(['/login']);
  }

  cargarUsuarios( desde: number = 0, limit: number = 10 )
  {
    let url = URL_BACKEND + '/usuario?desde=' + desde + '&limit=' + limit;

    return this._http.get( url );

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
      }),
      catchError( err => {
        //console.log(err.status);
        Swal.fire({
          icon: 'error',
          title: err.error.mensaje,
          text: err.error.errors.message
        });
        return throwError( err );
      }));  

  }

  buscarUsuarios( termino: string )
  {
    let url = URL_BACKEND + '/busqueda/coleccion/usuarios/' + termino;

    return this._http.get( url ).pipe( map( (resp: any) => resp.usuarios ) );
  }

  actualizarUsuario( usuario: Usuario )
  {
    let url = URL_BACKEND + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    
    return this._http.put( url, usuario ).pipe( map( (resp: any) => {

      // Actualizamos el local storage en caso de que la actualización del usuario haya sido del mismo
      if ( usuario._id === this.usuario._id )
      {
        // Debemos actualizar nuestro local storage para reflejar los cambios de la BD
        this._guardarStorage( resp.usuario._id, this.token, usuario, this.menu );
      }

      // Mandamos una notificación de sweetalert2 pero estilo toast      
      this._toastSwal('Usuario actualizado', 'success');

      return true;
    }),
    catchError( err => {
      //console.log(err.status);
      Swal.fire({
        icon: 'error',
        title: err.error.mensaje,
        text: err.error.errors.message
      });
      return throwError( err );
    })); 
  }

  eliminarUsuario( id: string )
  {
    let url = URL_BACKEND + '/usuario/' + id + '?token=' + this.token;

    return this._http.delete( url ).pipe( map( resp => true ) );
  }

  // El parámetro id es recibido por si se quiere cambiar la imagen de otro usuario
  cambiarImagen( archivo: File, id: string )
  {
    this._upload.subirArchivo( archivo, 'usuarios', id ).then( (resp: any) => {
      
      this.usuario.img = resp.usuario.img;

      // Debemos actualizar nuestro local storage para reflejar los cambios de la BD
      this._guardarStorage( id, this.token, this.usuario, this.menu );

      // Mandamos una notificación de sweetalert2 pero estilo toast      
      this._toastSwal('Imagen actualizada', 'success');

    })
    .catch( resp => {
      console.log(resp);
    });
  }

  estaLogueado()
  {
    return ( this.token.length > 0 ) ? true : false;
  }

  private _guardarStorage( id: string, token: string, usuario: Usuario, menu: any )
  {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    // Nota: la propiedad del id no la vamos a usar mucho
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  private _cargarStorage()
  {
    if ( localStorage.getItem('token') )
    {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    }
    else
    {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  private _toastSwal( titulo: string, icono: SweetAlertIcon )
  {
    // Mandamos una notificación de sweetalert2 pero estilo toast      
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    
    Toast.fire({
      icon: icono,
      title: titulo
    });
  }
  

}
