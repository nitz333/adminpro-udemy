import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService, HospitalService } from 'src/app/services/services.index';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  // A diferencia del video yo lo haré con reactive forms (usando FormBuilder, el cual se inyecta como servicio)
  // Nota: FormBuilder nos ayuda a reducir el código significativamente en vez de solo usar FormGroups
  medico: Medico = new Medico('');
  hospitales: Hospital[] = [];  
  forma: FormGroup;
  // Esta variable hospital nos ayudará a mostrar la foto y detalles del hospital seleccionado en el select
  hospitalSeleccionado: Hospital = new Hospital('');

  constructor( private _medicoService: MedicoService,
               private _hospitalService: HospitalService,
               private _controles: FormBuilder,
               private _router: Router,
               private _activatedRoute: ActivatedRoute,
               private _modalUploadService: ModalUploadService )
  {
    this.cargarHospitales();

    _activatedRoute.params.subscribe( req => {

      let id = req['id'];
  
      this.forma = this._controles.group({
        nombre: [ '', [Validators.required] ],
        hospital: [ null, [Validators.required] ]
      });

      if ( id !== 'nuevo' )
      {
        this.cargarMedico( id );       
      }

    });
  }

  ngOnInit()
  {
    // Para el modal de carga de imagen, vamos a subscribirnos a éste servicio para ser notificados de cambios
    this._modalUploadService.notificacion.subscribe( (resp: any) => {
      // Nota: Para ver los cambios se tendría que actualizar la página o en esta ocasión simplemente con:
      this.medico.img = resp.medico.img;
    });
  }

  cargarMedico( id: string )
  {
    this._medicoService.cargarMedico( id ).subscribe( (resp: any) => { 
      console.log(resp);
      this.medico = resp;

      // Llenamos los valores del formulario
      this.forma.controls['nombre'].setValue( this.medico.nombre );
      this.forma.controls['hospital'].setValue( this.medico.hospital['_id'] );
      // Cualquier cosa se le manda a cambioHospital, ya que esa función lee de todos modos directamente del formControl anterior
      this.cambioHospital('');
    });
  }

  guardar()
  {
    //console.log(this.forma.valid);
    //console.log(this.forma.value);
    if ( this.forma.invalid )
    {
      return;
    }

    this.medico.nombre = this.forma.value.nombre;
    this.medico.hospital = this.forma.value.hospital;

    let titulo = ( this.medico._id ) ? 'Médico actualizado' : 'Médico creado';

    this._medicoService.guardarMedico( this.medico ).subscribe( resp => {

      Swal.fire({
        icon:'success',
        title: titulo,
        text: this.medico.nombre
      });

      // POdemos inicializar el médico dado que el siguiente navigate no va a cambiar
      this.medico._id = resp._id;

      this._router.navigate(['/medico', resp._id]);

    });
  }

  cargarHospitales()
  {
    // Nota: en Mongoose el valor de 0 en el limit es equivalente a no establcer un límite
    this._hospitalService.cargarHospitales( 0, 0 ).subscribe( (resp: any) => {
      
      this.hospitales = resp.hospitales;
    });
  }

  cambioHospital( id )
  {
    // IMPORTANTE: Por alguna extraño razón los valores del select de hospitales traen el número del item
    //             en que se encuentran concatenado al valor, es una estupidez de Angular o algo,
    //             si yo uso event.target.value se ve este tonto error, por eso debo usar this.forma.controls.hospital.value,
    //             tengo la teoría de que event.target.value sirve para formularios por template y no reactivos.
    //console.log("event: ",event.target.value);
    //console.log("forma: ",this.forma.controls.hospital.value);

    this._hospitalService.obtenerHospital( this.forma.controls.hospital.value ).subscribe( resp => this.hospitalSeleccionado = resp );
  }

  cambiarFoto()
  {
    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }

}
