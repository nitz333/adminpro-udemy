import { Component, OnInit } from '@angular/core';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
declare function init_plugins();

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styles: []
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit()
  {
    init_plugins();
  }

}
