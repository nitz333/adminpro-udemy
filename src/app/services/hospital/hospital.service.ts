import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { URL_BACKEND } from 'src/app/config/config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private _http: HttpClient,
               private _usuarioService: UsuarioService ) {}

  cargarHospitales( desde: number = 0, limit: number = 10 )
  {
    let url = URL_BACKEND + '/hospital?desde=' + desde + '&limit=' + limit;

    return this._http.get( url );

  }

  crearHospital( nombre: string )
  {
    let url = URL_BACKEND + '/hospital';
    url += '?token=' + this._usuarioService.token;
    
    return this._http.post( url, { nombre } ).pipe( map( (resp: any) => resp.hospital )); 
  }

  buscarHospitales( termino: string )
  {
    let url = URL_BACKEND + '/busqueda/coleccion/hospitales/' + termino;

    return this._http.get( url ).pipe( map( (resp: any) => resp.hospitales ) );
  }

  actualizarHospital( hospital: Hospital )
  {
    let url = URL_BACKEND + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;
    
    return this._http.put( url, hospital ).pipe( map( (resp: any) => {

      // Mandamos una notificación de sweetalert2 pero estilo toast      
      this._toastSwal('Hospital actualizado', 'success');

      return true;
    }));
  }

  obtenerHospital ( id: string )
  {
    let url = URL_BACKEND + '/hospital/' + id;

    return this._http.get( url ).pipe( map( (resp: any) => resp.hospital ) );
  }

  eliminarHospital( id: string )
  {
    let url = URL_BACKEND + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this._http.delete( url ).pipe( map( resp => true ) );
  }

  public _toastSwal( titulo: string, icono: SweetAlertIcon )
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
