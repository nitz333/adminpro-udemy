import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/services.index';
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  // Nota: A diferencia del video, establecí en el backend un valor limit como parámetro en el get,
  //       este servirá para definir la cantidad de registros por página
  limit: number = 2;
  totalRegistros: number = 0;
  loading: boolean = true;

  constructor( private _hospitalService: HospitalService,
               private _modalUploadService: ModalUploadService ) { }

  ngOnInit()
  {
    this.cargarHospitales();

    // Para el modal de carga de imagen, vamos a subscribirnos a éste servicio para ser notificados de cambios
    this._modalUploadService.notificacion.subscribe( resp => this.cargarHospitales() );
  }

  cargarHospitales()
  {
    this.loading = true;

    this._hospitalService.cargarHospitales( this.desde, this.limit ).subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
      this.loading = false;
    });
  }

  crearHospital()
  {
    Swal.fire({
      icon: 'question',
      title: 'Crear un nuevo hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        required: 'true'
      },
      validationMessage: 'Debe asignar un nombre',
      confirmButtonText: '<i class="fa fa-save"></i> Guardar',
      confirmButtonAriaLabel: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then( result => {

      this._hospitalService.crearHospital( result.value ).subscribe( () => {
        this.cargarHospitales();
        this._hospitalService._toastSwal(`Hospital "${ result.value }" ha sido creado.`, 'success');
      });

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
    // Debemos validar que 'desde' no sea menor a 0 ni mayor a la cantidad de páginas permitidas totales.
    if ( desde < 0 || desde >= this.totalRegistros )
    {
      return;
    }
    else
    {
      this.desde += limit;
      this.cargarHospitales();
    }
  }

  buscarHospital( termino: string )
  {
    // Validamos que el termino no sea vacío
    if ( termino.length <= 0 )
    {
      this.cargarHospitales();
      return;
    }

    this.loading = true;

    this._hospitalService.buscarHospitales( termino ).subscribe( (resp: Hospital[]) => {
      this.hospitales = resp;
      this.loading = false;
    });
  }

  guardarHospital( hospital: Hospital )
  {
    this._hospitalService.actualizarHospital( hospital ).subscribe();
  }

  borrarHospital( hospital: Hospital )
  {
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

        // Eliminamos el hospital
        this._hospitalService.eliminarHospital( hospital._id ).subscribe( resp => {
          // Antes de cargar los hospitales validemos un caso particular (se deja como tarea moral en el video 184),
          // cuando se elimina al último hospital de la lista y además este es único en la página actual,
          // debería de regresarse a una página válida para que el usuario no vea una página vacía tras la
          // eliminación (paginación excedida):
          // Nota: (this.totalRegistros - 1) es menos 1 ya que totalRegistros se actualiza hasta que es llamado
          //       el método cargarHospitales(), pero nos adelantamos al saber que se ha restado un registro tras eliminar.
          if ( (this.totalRegistros - 1) <= this.desde )
          {
            this.desde -= this.limit;
          }

          this.cargarHospitales();
          console.log(resp);
        } );

        Swal.fire(
          '¡Hospital eliminado!',
          hospital.nombre,
          'success'
        )
      }
    })
  }

  mostrarModal( id: string )
  {
    this._modalUploadService.mostrarModal( 'hospitales', id );
  }

}
