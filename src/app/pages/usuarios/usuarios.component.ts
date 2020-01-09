import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  // Nota: A diferencia del video, establecí en el backend un valor limit como parámetro en el get,
  //       este servirá para definir la cantidad de registros por página
  limit: number = 2;
  totalRegistros: number = 0;
  loading: boolean = true;

  constructor( private _usuarioService: UsuarioService,
               private _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();

    // Para el modal de carga de imagen, vamos a subscribirnos a éste servicio para ser notificados de cambios
    this._modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios()
  {
    this.loading = true;

    this._usuarioService.cargarUsuarios( this.desde, this.limit ).subscribe( (resp: any) => {
      this.usuarios = resp.usuarios;
      this.totalRegistros = resp.total;
      this.loading = false;
    });
  }

  cambiarPagina( direccion: string )
  {
    // Con ayuda del valor limit vamos a saber hacia que dirección (página anterior o siguiente) cambiar la página
    let limit = this.limit;
    if ( direccion === 'anterior' )
    {
      limit = -this.limit;
    }

    // Ese valor del limit es el que se usa aquí (lo anterior es para saber si suma o resta)
    let desde = this.desde + limit;
 
    
    // Nota: A diferencia del video voy a considerar el valor limit que si considero en el backend:
    // let paginaMaxima = Math.ceil( this.totalRegistros/this.limit );
    // Nota: El (desde + 1) es porque en el backend la consulta el registro 0 es el primero al usarse un LIMIT
    //if ( desde < 0 || ( (desde + 1) > this.totalRegistros || desde > (paginaMaxima * this.limit ) ) )
    // Este codigo funciona bien pero fue más claro y corto el de Fernando:

    // Debemos validar que 'desde' no sea menor a 0 ni mayor a la cantidad de páginas permitidas totales.
    if ( desde < 0 || desde >= this.totalRegistros )
    {
      return;
    }
    else
    {
      this.desde += limit;
      this.cargarUsuarios();
    }

  }

  buscarUsuario( termino: string )
  {
    // Validamos que el termino no sea vacío
    if ( termino.length <= 0 )
    {
      this.cargarUsuarios();
      return;
    }

    this.loading = true;

    this._usuarioService.buscarUsuarios( termino ).subscribe( (resp: Usuario[]) => {
      this.usuarios = resp;
      this.loading = false;
    });
  }

  guardarUsuario( usuario: Usuario )
  {
    this._usuarioService.actualizarUsuario( usuario ).subscribe();
  }

  borrarUsuario( usuario: Usuario )
  {
    // IMPORTANTE: Un usuario no se puede borrar a sí mismo
    if ( usuario._id === this._usuarioService.usuario._id )
    {
      Swal.fire({
        icon: 'error',
        title: 'Acción no permitida',
        text: 'No se puede eliminar a sí mismo.'
      });
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: "¡Esta acción no podrá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        // Eliminamos al usuario
        this._usuarioService.eliminarUsuario( usuario._id ).subscribe( resp => {
          // Antes de cargar los usuarios validemos un caso particular (se deja como tarea moral en el video 184),
          // cuando se elimina al último usuario de la lista y además este es único en la página actual,
          // debería de regresarse a una página válida para que el usuario no vea una página vacía tras la
          // eliminación (paginación excedida):
          // Nota: (this.totalRegistros - 1) es menos 1 ya que totalRegistros se actualiza hasta que es llamado
          //       el método cargarUsuarios(), pero nos adelantamos al saber que se ha restado un registro tras eliminar.
          if ( (this.totalRegistros - 1) <= this.desde )
          {
            this.desde -= this.limit;
          }

          this.cargarUsuarios();
          console.log(resp);
        } );

        Swal.fire(
          '¡Usuario eliminado!',
          usuario.email,
          'success'
        )
      }
    })
  }

  mostrarModal( id: string )
  {
    this._modalUploadService.mostrarModal( 'usuarios', id );
  }

}
