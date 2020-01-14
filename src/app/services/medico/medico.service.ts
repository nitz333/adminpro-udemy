import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_BACKEND } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private _http: HttpClient,
               private _usuarioService: UsuarioService ){}

  cargarMedicos( desde: number = 0, limit: number = 10 )
  {
    let url = URL_BACKEND + '/medico?desde=' + desde + '&limit=' + limit;

    return this._http.get( url );
  }

  cargarMedico( id: string )
  {
    let url = URL_BACKEND + '/medico/' + id;

    return this._http.get( url ).pipe( map( (resp: any) => resp.medico ));
  }

  // Esta función crea o actualiza un médico
  guardarMedico( medico: Medico )
  {
    let url = URL_BACKEND + '/medico';
    
    if ( medico._id )
    {
      // Se hará una actualización
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this._http.put( url, medico ).pipe( map( (resp: any) => resp.medico ));
    }
    else
    {
      // Se hará una creación
      url += '?token=' + this._usuarioService.token;

      return this._http.post( url, medico ).pipe( map( (resp: any) => resp.medico ));
    }

  }

  buscarMedicos( termino: string )
  {
    let url = URL_BACKEND + '/busqueda/coleccion/medicos/' + termino;

    return this._http.get( url ).pipe( map( (resp: any) => resp.medicos ) );
  }

  eliminarMedico( id: string )
  {
    let url = URL_BACKEND + '/medico/' + id + '?token=' + this._usuarioService.token;

    return this._http.delete( url ).pipe( map( resp => true ) );
  }


}
