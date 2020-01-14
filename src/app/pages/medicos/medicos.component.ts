import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/services.index';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  // Nota: A diferencia del video, establecí en el backend un valor limit como parámetro en el get,
  //       este servirá para definir la cantidad de registros por página
  limit: number = 2;
  totalRegistros: number = 0;
  loading: boolean = true;

  constructor( private _medicoService: MedicoService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos()
  {
    this.loading = true;

    this._medicoService.cargarMedicos( this.desde, this.limit ).subscribe( (resp: any) => {

      this.medicos = resp.medicos;
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
      this.cargarMedicos();
    }

  }

  buscarMedico( termino: string )
  {
    // Validamos que el termino no sea vacío
    if ( termino.length <= 0 )
    {
      this.cargarMedicos();
      return;
    }

    this.loading = true;

    this._medicoService.buscarMedicos( termino ).subscribe( (resp: Medico[]) => {
      this.medicos = resp;
      this.loading = false;
    });
  }

  borrarMedico( medico: Medico )
  {
   console.log(medico); 
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

        // Eliminamos el médico
        this._medicoService.eliminarMedico( medico._id ).subscribe( resp => {
          // Antes de cargar a los médicos validemos un caso particular (se deja como tarea moral en el video 184),
          // cuando se elimina el último médico de la lista y además este es único en la página actual,
          // debería de regresarse a una página válida para que el usuario no vea una página vacía tras la
          // eliminación (paginación excedida):
          // Nota: (this.totalRegistros - 1) es menos 1 ya que totalRegistros se actualiza hasta que es llamado
          //       el método cargarMedicos(), pero nos adelantamos al saber que se ha restado un registro tras eliminar.
          if ( (this.totalRegistros - 1) <= this.desde )
          {
            this.desde -= this.limit;
          }

          this.cargarMedicos();
          console.log(resp);
        } );

        Swal.fire(
          '¡Médico eliminado!',
          medico.nombre,
          'success'
        )
      }
    })
  }



}
