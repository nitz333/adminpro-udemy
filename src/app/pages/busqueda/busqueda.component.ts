import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_BACKEND } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor( private _activatedRoute: ActivatedRoute,
               private _http: HttpClient )
  {
    _activatedRoute.params.subscribe( req => {
      let termino = req['termino'];
      this.buscar( termino );
    });
  }

  ngOnInit() {
  }

  buscar( termino: string )
  {
    //Nota: Podríamos crear un servicio como lo hemos estado haciendo y que sea exclusivo para
    //      búsquedas, pero como en este caso nuestra función de búsqueda es muy simple, haremos
    //      la petición al backend desde aquí:
    let url = URL_BACKEND + '/busqueda/todo/' + termino;

    this._http.get( url ).subscribe( (resp: any) => {
      
      this.usuarios = resp.usuarios;
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;

    });
  }

}
