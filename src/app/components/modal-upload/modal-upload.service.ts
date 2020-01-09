import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  // Este servicio requiere de algunas variables de clase útiles:
  
  public tipo: string; // Para saber qué tipo de imagen fue cargada
  public id: string; // Para saber el id del usuario a quien corresponde la imagen

  public oculto: string = 'oculto'; // El modal controlará su display

  // Muy importante, para informar a las pantallas que usen (o se suscriban) a este modal,
  // puedan ser informados cuando se ha cargado una imagen y entonces se actualicen.
  // Nota: Vamos a emitir <any> ya que devolveremos el obtejo respuesta de la petición
  public notificacion = new EventEmitter<any>();

  constructor()
  {
    console.log("Modal Service listo");
  }

  ocultarModal()
  {
    this.oculto = 'oculto';
    // Seteamos los atributos a null al ocultar el modal
    this.tipo = null;
    this.id = null;
  }

  mostrarModal( tipo: string, id: string )
  {
    this.oculto = '';
    // Seteamos los atributos con los datos del usuario seleccionado al mostrar el modal
    this.tipo = tipo;
    this.id = id;
  }
}
