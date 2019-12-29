import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;

  constructor( private _router: Router,
               private _title: Title,
               private _meta: Meta )
  {
    this.getDataRoute().subscribe( data => {
      //console.log(data);
      this.titulo = data.titulo; // Se muestra en los breadcrumbs

      // Este es para el <title> tag del HTML, Angular dispone de esta clase para manipularlo:
      this._title.setTitle( this.titulo );

      // Vamos a definir unos meta tags con base en la página donde nos encontremos:
      // Nota: Visitar https://www.w3schools.com/tags/tag_meta.asp para ver las propiedades de los meta tags
      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo
      };
      // Actualizamos el meta tag
      this._meta.updateTag( metaTag );

    });
  }

  ngOnInit() {
  }

  getDataRoute()
  {
    return this._router.events.pipe(

      filter( evento => evento instanceof ActivationEnd ), // Para entender estos filtros, imprimase el 'event' del subscribe
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd) => evento.snapshot.data )

    );
  }

}
