import { Pipe, PipeTransform } from '@angular/core';
import { URL_BACKEND } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any
  {
    // La primera verificación es sencilla, dado que la imagen puede venir de google, estas viven
    // en un dominio https y realmente no hay algo qué hacerle, así que podemos verificar esto en la imagen:
    if ( img !== undefined && img.indexOf('https') >= 0 )
    {
      return img;
    }

    // Para las imagenes en base64 que se usaran para el preview
    if( img.indexOf('base64') >= 0)
    {
      return img;
    }

    // Fuera de esto, las imágenes se encuentran en nuestro servidor backend, pudiendo ser usuarios, medicos u hospitales.

    let url = URL_BACKEND + '/img';

    // Nuestro servicio de backend regresa una imagen por defecto si no encuentra la imagen solicitada,
    // aprovechando esto podemos asegurarnos cuando recibamos algún undefined
    if (!img || undefined)
    {
      return url + '/usuarios/xyz';
    }

    switch ( tipo )
    {
      case 'usuario':
        url += '/usuarios/' + img;
      break;

      case 'medico':
        url += '/medicos/' + img;
      break;

      case 'hospital':
        url += '/hospitales/' + img;
      break;

      default:
        console.log("Tipo de imagen no existe");
        url += '/usuarios/xyz';
    }

    return url;
  }

}
