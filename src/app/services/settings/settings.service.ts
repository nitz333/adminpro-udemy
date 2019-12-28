import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  }

  constructor( @Inject(DOCUMENT) private _document )
  {
    // Para cargar los ajustes cuando el servicio sea invocado por primera vez (lo hago en la inyección al pages.component.ts)
    this.cargarAjustes();
  }

  guardarAjustes()
  {
    localStorage.setItem('ajustes', JSON.stringify( this.ajustes ) );
    //console.log('¡Ajustes guardados en localStorage!');
  }

  cargarAjustes()
  {
    if ( localStorage.getItem('ajustes') )
    {
      this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
      this.aplicarTema( this.ajustes.tema );
      //console.log('Ajuestes cargados de localStorage');
    }
    else
    {
      this.aplicarTema( this.ajustes.tema );
      //console.log('Usando ajustes por defecto');
    }

  }

  aplicarTema( tema: string )
  {
    let url = `assets/css/colors/${ tema }.css`;
    this._document.getElementById('tema').setAttribute( 'href', url );

    // Actualizamos los ajustes
    this.ajustes.temaUrl = url;
    this.ajustes.tema = tema;
    this.guardarAjustes();
  }

}

interface Ajustes {

  temaUrl: string;
  tema: string;

}
