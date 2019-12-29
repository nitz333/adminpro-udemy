import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  // Para poder destruir la suscripción cuando el componente entre a ngOnDestroy, debo crear esta variable
  subscripcion: Subscription;

  constructor()
  {
    // IMPORTANTE: Los subscribe tienen tres callbacks:
    //               primero, cuando se recibe información (notificaciones) con next();
    //               segundo, cuando error
    //               tercero, cuando el observable termina con complete() (esta función no recibe ni envía argumentos)
    // NOTA: Todos los Observables a partir de la versión rxjs 6 o superior (ver archivo package.json para saber nuestra
    //       versión), tienen una función pipe(), el cual permite hacer procesos de transformaciones de data  
    this.subscripcion = this.miObservableBasico()
    /*.pipe(
      retry(2) // el retry() es ejecutado cuando el observer lanza un error()
              // Nota: retry() recibe como argumento el número de intentos, sino lo recibe será infinita la cantidad de intentos. 
    )*/
    .subscribe(
      respuesta => console.log('Subs: ', respuesta),
      error => console.error('Error en el observable', error),
      () => console.log('El objeto Observable terminó')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy()
  {
    console.log('La página se va a cerrar we...');
    this.subscripcion.unsubscribe();
  }

  miObservableBasico(): Observable<any>
  {
    let observable = new Observable( (observer:Subscriber<any>) => { // Importante: 'observer' por defecto es siempre de tipo 'Subscriber'

      let contador = 0;

      let intervalo = setInterval( () => {

        contador++;

        // Supongamos que se devuelve ahora un objeto en lugar de un simple número (esto lo hago para ver como funciona el operador map)
        const salida = {
          valor: contador
        }

        // Los Observable trabajan con un flujo (stream) de datos y con next() notificamos cambios al subscritor, en este caso 'observer'.
        // Tip: De hecho, next() es el primer callback llamado en el método subscribe de un Observable.
        observer.next( salida );

        /* Lo comenté para ver como desinscribirme de un Observable cuando abandono la página con el ciclo del componente OnDestroy
        if ( contador === 3 )
        {
          clearInterval( intervalo ); // Detenemos el intervalo
          // Con complete() detenemos la escucha del observable
          observer.complete(); 
        }
        */

        /* Lo comenté para ver como funciona el operador map
        if ( contador === 2 )
        {
          //clearInterval( intervalo ); // Detenemos el intervalo, esta linea puede comentarse para ver el poder del retry()
          // Nota: cuando el observer lanza error(), esto terminaría con el Observable a menos que se reintente su ejecución
          //       con el operador retry() (el reintento se ejecuta justo donde se quedó el observer, es decir, no reinicia
          //       todo el código del Observable y aquí radica el poder de estos objetos)
          observer.error('Auxilio!');
        }
        */

      }, 1000 );

    }).pipe( 
      // El operador map() permite transformar la respuesta en crudo del Observador 
      map( raw => raw.valor ),
      // El operador filter funciona como un interruptor de luz (encendido/apagado) por tal SIEMPRE debe regresar un boolean.
      // Nota: filter puede recibir dos argumentos: la respuesta en crudo del Observador (aunque en este ejemplo
      //       esa respuesta ya fue antecedida por el map()); y el número de veces que filter() ha recibido notificaciones
      //       del Observador
      filter( (valor, index) => {
        //console.log('Filter', valor, index);

        if ( valor % 2 === 1 ) 
        {
          // impar
          return true;
        }
        else 
        {
          // par
          return false;
        }
      })
    );

    return observable; // Se pudo haber hecho el return inmediato en vez de definir el let observable.
  }

}
