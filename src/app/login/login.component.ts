import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor( private _router: Router ) { }

  ngOnInit()
  {
    init_plugins();
  }

  ingresar()
  {
    console.log("Ingresando");
    this._router.navigate( ['/dashboard'] );
  }

}
