import { Component, OnInit } from '@angular/core';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
declare function init_plugins();

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['../../../assets/css/pages/error-pages.css']
})
export class Error404Component implements OnInit {

  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit()
  {
    init_plugins();
  }

}
