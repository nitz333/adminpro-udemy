import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/services.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  // A diferencia del video yo lo haré con reactive forms
  forma: FormGroup;
  // Para la parte de la imagen (útil para detectar cambios en ella)
  imagenASubir: File;
  // Para hacer un preview de la imagen del lado del cliente (en el html estará escondida debajo de la imagen actual del usuario)
  imagenTmp: string;

  constructor( private _usuarioService: UsuarioService )
  {
    this.usuario = _usuarioService.usuario;

    // Nota: Solo los usuarios con email de Google no podrán editar el mismo
    this.forma = new FormGroup({
      nombre: new FormControl( this.usuario.nombre, Validators.required ),
      primer_apellido: new FormControl( this.usuario.primer_apellido, Validators.required ),
      segundo_apellido: new FormControl( this.usuario.segundo_apellido ),
      email: new FormControl( {value: this.usuario.email, disabled: this.usuario.google }, [Validators.required, Validators.email] )
    });
  }

  ngOnInit(){}

  guardar()
  {
    //console.log(this.forma);
    this.usuario.nombre = this.forma.value.nombre;
    this.usuario.primer_apellido = this.forma.value.primer_apellido;
    this.usuario.segundo_apellido = this.forma.value.segundo_apellido;

    // Es importante validar aquí también por el email, de hecho esta validación faltó hacerla en
    // el backend. Solo los usuarios que no tienen email de Google pueden editarlo, y para comprobar
    // esto (siendo muy desconfiados) validaremos el atributo google pero no del formulario sino de
    // nuestro objeto usuario local
    if ( !this.usuario.google )
    {
      this.usuario.email = this.forma.value.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario ).subscribe();
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

  cambiarImagen()
  {
    // Nota: El método para cambiar imagen se encuentra en el usuario.service.ts y allí éste llama al upload.service.ts,
    //       esto debido a que el usuario.service.ts cuenta con toda la información del usuario.
    this._usuarioService.cambiarImagen( this.imagenASubir, this.usuario._id );
  }

}
