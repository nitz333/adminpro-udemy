import { Injectable } from '@angular/core';
import { URL_BACKEND } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string )
  {
    // Nota: Dado que a la fecha Angular no cuenta con alguna librería o instrucción para subir archivos
    //       (similar a un http.post), necesitamos escribir Vanilla Javascript para realizar la carga de archivos.


    return new Promise ( (resolve, reject) => {

      // Este será como el payload a subir con Ajax
      let formData = new FormData();
      // Inicializamos la petición Ajax
      let xhr = new XMLHttpRequest();
      // Configuramos nuestro formData (donde 'imagen' es el nombre del parámetro que recibe nuestro Endpoint de subir
      // archivos en nuestro backend)
      formData.append( 'imagen', archivo, archivo.name );
  
      // Ahora configuremos la petición Ajax
      xhr.onreadystatechange = function(){
        // Este espacio es como una especie de observable, pero solo me interesa el estado 4, cuando termina el proceso.
        // Nota: incluso antes de llegar a ese estado 4, se pudiera jugar con el xhr para hacer loadings u
        //       otras cosas. Pero en nuestro caso no lo haremos.
        if ( xhr.readyState === 4 )
        {
          // Ya que terminó el proceso veremos si estuvo correcto:
          if ( xhr.status === 200 )
          {
            // Para notificar a las pantallas de esto, fue la causa del porque todo esto, se
            // envolvió dentro de una Promesa. Así que si todo estuvo bien:
            console.log('Imagen subida correctamente!');
            // Conviene devolver la respuesta en formato json
            resolve( JSON.parse(xhr.response) );
          }
          else
          {
            // Cualquier otro estado será una carga fallida, de todos modos deberemos devolver
            // la respuesta del servidor que nos traerá los errores ocurridos.
            console.log('Falló la subida.');
            reject( xhr.response );
          }
          
        }
      }

      let url = URL_BACKEND + '/upload/' + tipo + '/' + id;

      // Guardamos el archivo
      xhr.open('PUT', url, true);
      // Enviamos el archivo
      xhr.send( formData );
      
    });

    
  }
}
