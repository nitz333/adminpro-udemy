import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { SettingsService } from 'src/app/services/services.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( @Inject(DOCUMENT) private _document,
               private _settingsService: SettingsService ) { }

  ngOnInit()
  {
    // Esto pone la palomita en el color del tema seleccionado al cargar la página
    this._colocarCheck();
  }

  cambiarColor( tema: string, link: any )
  {
    //console.log(link);
    this._aplicarCheck( link );

    // Le decimos al servicio settings que vamos a hacer cambios
    this._settingsService.aplicarTema( tema );

  }

  private _aplicarCheck( link: any )
  {
    // Pudiéramos hacer lo siguiente con el _document, pero lo haremos mejor con Vanilla Javascript (Javascript puro)
    let selectores: any = document.getElementsByClassName('selector'); // regresa un arreglo de todos los elementos html con la clase 'selector'
    //console.log(selectores);
    for ( let selector of selectores )
    {
      // Con Vanilla, quitamos la clase (si hubiera) 'working':
      selector.classList.remove('working');
    }
    // Con Vanilla, agregamos la clase 'working' al elemento #link
    link.classList.add('working');

  }

  private _colocarCheck()
  {
    // Pudiéramos hacer lo siguiente con el _document, pero lo haremos mejor con Vanilla Javascript (Javascript puro)
    let selectores: any = document.getElementsByClassName('selector'); // regresa un arreglo de todos los elementos html con la clase 'selector'

    let tema = this._settingsService.ajustes.tema;
    // Recordando que al cargar la página no hay ningún selector con la clase 'working'
    for ( let selector of selectores )
    {
      if ( selector.getAttribute('data-theme') === tema )
      {
        selector.classList.add('working');
        break; // Para eficientizar, ya que una vez que lo encuentre no habrá otro selector que corresponda a la condición.
      }
    }

  }



}
