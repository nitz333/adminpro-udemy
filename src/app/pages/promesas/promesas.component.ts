import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor()
  {
    // IMPORTANTE: Las promesas tienen dos callbacks:
    //               then() si la promesa viene de resolve();
    //               catch() si viene de reject().
    //             Estos callbacks son excluyentes entre sí.
    this.miPromesaBasica().then( respuesta => {
      console.log('Promesa exitosa', respuesta);
    }).catch( error => {
      console.error('Promesa fallida', error);
    });
  }

  ngOnInit() {
  }

  // Solo por ser específico esta Promesa regresará un boolean
  miPromesaBasica(): Promise<boolean>
  {
    let promesa: Promise<boolean> = new Promise( (resolve, reject) => {

      let contador = 0;

      let intervalo = setInterval( () => {

        contador++;
        console.log(contador);

        if ( contador === 3 )
        {
          resolve(true);
        }
        
        if ( contador === 5 )
        {
          clearInterval( intervalo ); // Detenemos el intervalo
          reject(false); // Este reject nunca lo va a hacer ya que la promesa lanza lo primero
                                                // que haya sido, en este caso fue el resolve anterior.
                                                /* Y lo de solo una vez es importante porque una vez la promesa
                                                   toma un valor, no se modificará. Se dice que la promesa se ha cumplido,
                                                   resuelto o establecido.*/
        }

      }, 1000 )

    });
    return promesa; // Se pudo haber hecho el return inmediato en vez de definir el let promesa.
  }

}
