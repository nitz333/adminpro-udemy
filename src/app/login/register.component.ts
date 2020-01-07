import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
// Ayuda a que la página no se quede con el loading al cargarla por primera vez (ngOnInit()).
declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './login.component.css' ]
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor( private _usuarioService: UsuarioService,
               private _router: Router ) { }

  ngOnInit()
  {
    init_plugins();

    // Haremos un formulario reactivo para el registro de usuarios:
    // Notas: * Es sugerible que en el HTML existan atributos required (sin asignación de valor, i.e. sin =""),
    //          de este modo el HTML también nos podría ayudar a validar campos obligatorios.
    //        * Otra sugerencia es establecer el atributo name con el nombre que definamos al FormControl.
    //        * Los'terminos' son obligatorios pero haremos que salga un popup si no se marca, por eso
    //          aquí no lo marcaremos como requeridos.
    // Tips: * Cuando trabajamos con Angular, este deshabilita las validaciones nativas de JavaScript en el navegador,
    //         este comportamiento puede comprobarse al hacer submit y ver que la información de envía pese a que
    //         hay inputs required, es buena práctica usar la directiva ngNativeValidate sobre el form.
    //       * Para ver los errores (con propósito de debugeo) de las validaciones hechas por el FormGroup,
    //         puede ponerse en el HTML {{ forma.errors | json }} en alguna parte y se verán en tiempo real.
    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      apellidos: new FormControl( null, Validators.required ),
      email: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      terminos: new FormControl( false )
    }, { validators: this.cadenasIdenticas('password', 'password2') });

    // Para llenar el form con datos predeterminados (obvio debe comentarse en producción)
    this.forma.setValue({
      nombre: 'Julianito',
      apellidos: 'Pérez Monroy',
      email: 'julianito@mail.com',
      password: '123qwe',
      password2: '123qwe',
      terminos: true
    });
  }

  registrarUsuario()
  {
    if ( this.forma.invalid )
    {
      return;
    }

    if ( !this.forma.value.terminos )
    {
      Swal.fire({
        icon:'warning',
        title: 'Importante',
        text: 'Debe aceptar los términos'
      });
      console.log("Debe aceptar los términos");
      return;
    }

    // Vamos a crear el modelo usuario para mandarlo al servicio
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.apellidos,
      this.forma.value.email,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario( usuario ).subscribe( resp => this._router.navigate(['/login']) );

  }

  cadenasIdenticas( elemento1: string, elemento2: string )
  {
    return ( group: FormGroup ) => {
      
      let campo1 = group.controls[elemento1].value;
      let campo2 = group.controls[elemento2].value;

      if ( campo1 === campo2 )
      {
        // Será null para que la validación no se active
        return null;
      }

      // Si no son iguales se debe indicar al activar esta validación
      // Nota: el nombre de cadenasIdenticas es solo para ser consistentes con el nombre de la función
      return {
        cadenasIdenticas: true
      }

    }
  }

}
