import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
// Ayuda a que la página no se quede con el loading al cargarla por primera vez (ngOnInit()).
declare function init_plugins();

// La parte de autenticación con Google vamos a hacerla de este lado con TypeScript en vez del lado de html.
// Para eso vamos a basarnos de la documentación de Google "Integrate Sign-In Using Listeners". Para hacer esto,
// lo único que me interesan son un par de cosas: la librería gapi y el objeto auth2. La primera se encuentra en
// el index.html, es la librería platform.js (ésta contiene la gapi) entonces vamos a decirle a TypeScript que
// confie en nosotros de que existe allí (al igual que con el truco del init_plugins()) la asumimos con:
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  // La segunda cosa para la autenticación con Google es:
  auth2: any; // The Sign-In object.

  constructor( private _router: Router,
               private _usuarioService: UsuarioService,
               private _ngZone: NgZone ) { }

  ngOnInit()
  {
    init_plugins();
    this.googleInit();

    // Tip: En el html solo usaremos [ngModel]="email" ya que el email para este caso solo me interesa reflejar de aquí (.ts)
    //      para allá (.html)
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1)
    {
      this.recuerdame = true;
    }
  }

  // Esta función tendrá todo lo necesario para la inicialización del plugin
  googleInit()
  {
    // Usaremos una función de flecha para inicializar auth2 y establecer los listeners
    // Nota: cookiepolicy es para decir que solo de este sitio se va a salir
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '1072268678507-eddnhv3bmha73esu48qne6nukobnpud5.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      // Para que se muestre el popup de autenticación de Google
      this.attachSignIn( document.getElementById('btnGoogle') );
    });
  }

  // Este función contendrá el callback que será ejecutado luego de que el usuario presione el botón
  // de 'Iniciar sesión con Google'
  // Nota: Esta parte se hace con la documentación de Google "Get Profile Information"
  attachSignIn( element )
  {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      
      //let profile = googleUser.getBasicProfile();
      // Con el token de Google es como vamos a crear al usuario y la autenticación
      let token = googleUser.getAuthResponse().id_token;

      // IMPORTANTE: Por alguna extraña razón, si usamos el router navigate en esta forma de autenticación
      //             con Google, obtenemos un warning ("Navigation triggered outside Angular zone, did you
      //             forget to call 'ngZone.run()'?) y además los componentes de la página no cargan correctamente
      //             a menos que se actualize manualmente la página, por tal motivo podría usarse Vanilla Javascript
      //             para la redirección (resp => window.location.href = '#/dashboard') pero en vez de eso usaremos
      //             la librería NgZone como dice el warning (por eso se tuvo que importar e inyectar en este archivo):
      this._usuarioService.loginGoogle( token ).subscribe( resp => this._ngZone.run( () => this._router.navigate(['/dashboard'])));
    });
  }

  ingresar( forma: NgForm )
  {
    // console.log(forma.valid);
    if ( forma.invalid )
    {
      return;
    }
    
    let usuario = new Usuario( null, null, forma.value.email, forma.value.password );

    this._usuarioService.login( usuario, forma.value.recuerdame ).subscribe( resp => this._router.navigate( ['/dashboard'] ));
  }

}
