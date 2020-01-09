import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/services.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  // Para la parte de la imagen (útil para detectar cambios en ella)
  imagenASubir: File;
  // Para hacer un preview de la imagen del lado del cliente (en el html estará escondida debajo de la imagen actual del usuario)
  imagenTmp: string;

  constructor( private _uploadService: UploadService,
               public modalUploadService: ModalUploadService ){

               }

  ngOnInit() {
  }

  seleccionImagen( archivo: File )
  {
    // Nota: Desde el html en lugar de recibir todo el objeto (event) de upload que se genera al hacer click,
    //       recibiremos en particular el primer elemento del arreglo files que vive dentro del target del objeto.
    //       Para entender a que me refiero puede mandarse el $event completo e imprimirse (console.log( event );)
    console.log(archivo);

    // Si el usuario habre la ventana de archivos pero se arrepiente y cancela
    if ( !archivo )
    {
      this.imagenASubir = null;
      return;
    }

    // Para hacer un preview de la imagen, primero nos aseguramos (aunque sea algo básico) que sea un archivo de imagen
    if ( archivo.type.indexOf('image') < 0 )
    {
      Swal.fire({
        icon: 'error',
        title: 'Sólo imágenes',
        text: 'El archivo seleccionado no es una imagen'
      });
      this.imagenASubir = null;
      return;
    }

    // Como es una imagen válida, establecemos los valores necesarios por si el usuario decide actualizar más adelante
    this.imagenASubir = archivo;

    // En cuanto a la imagen preview, lo haremos con Vanilla JavaScript
    let reader = new FileReader();
    let urlImagenTmp = reader.readAsDataURL( archivo );
    // Usare función de flecha en vez de .... = function().... para no perder el contexto
    // Nota: reader.result entrega la imagen en base64
    reader.onloadend = () => this.imagenTmp = reader.result.toString();
    
  }

  subirImagen()
  {
    this._uploadService.subirArchivo( this.imagenASubir, this.modalUploadService.tipo, this.modalUploadService.id )
      .then( resp => {
        console.log(resp);
        this.modalUploadService.notificacion.emit ( resp );
        this.cerrarModal();
      })  
      .catch( err => {
        console.log("Error en la carga", err);
      });
  }

  cerrarModal()
  {
    // Seteamos los atributos de imagen a null al cerrar el modal
    this.imagenTmp = null;
    this.imagenASubir = null;

    this.modalUploadService.ocultarModal();
  }

}
