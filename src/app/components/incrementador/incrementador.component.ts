import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  /* Valores de variables de clase por defecto */

  @ViewChild('txtProgress', { static: false } ) txtProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor()
  {
    //console.log('(constructor) leyenda: ', this.leyenda);
    //console.log('(constructor) progreso: ', this.progreso);
  }

  ngOnInit()
  {
    //console.log('(ngOnInit) leyenda: ', this.leyenda);
    //console.log('(ngOnInit) progreso: ', this.progreso);
  }

  // Esta función aplica a los button
  cambiarValor( valor: number )
  {
    // Para saber con anterioridad si el valor de la operación se sale del umbral de 0 a 100.
    let preCambio:number = this.progreso += valor;

    if ( preCambio < 0 )
    {
      this.progreso = 0;
    }
    else if ( preCambio > 100 )
    {
      this.progreso = 100;
    }
    else
    {
      // Realizamos el cambio
      this.progreso = preCambio;
      // Y lo emitimos para quien nos esté escuchando
      this.cambioValor.emit(this.progreso);
      // Como detalle agradable al usuario (y aprovechando la presencia del @ViewChild), se pondrá el foco sobre el input:
      this.txtProgress.nativeElement.focus();
    }
  }

  // Esta función aplica al input type number (con ayuda del ngModelChange)
  onChanges( newValue: number )
  {
    //console.log(newValue);
    // Necesitamos obtener el valor del input para poder ajustarlo a nuestras reglas (valores permitidos) de this.progreso:
    // Nota: getElementsByName de vanilla javascript regresa un arreglo de todos los elementos con dicho nombre
    //let elementHtml:any = document.getElementsByName('progreso')[0]; // El [0] sirve si solo hay un elemento con el nombre, sino habrá muchos y eso es un problema

    console.log(this.txtProgress);


    if ( newValue >= 100 )
    {
      this.progreso = 100;
    }
    else if ( newValue <= 0 )
    {
      this.progreso = 0;
    }
    else
    {
      this.progreso = newValue;
    }

    // Auí esta la clave respecto a elementHtml, en vez de que el input acepte cualquier cosa por el usuario y su teclado,
    // el valor de elementHtml va a ser solo el que tenga this.progreso que ya está bien formateado a estas alturas.
    // Nota: pusimos arriba que elementHtml es de tipo any para que no chille cuando queremos leer sus atributos
    //elementHtml.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;

    // Emitimos el cambio para quien escuche
    this.cambioValor.emit(this.progreso);
  }

}
