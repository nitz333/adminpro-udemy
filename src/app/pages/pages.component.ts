import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/services.index';

// Esta función es con la que envolvimos el script assets/js/custom.js (ver video 64)
declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor( private _settingsService: SettingsService ) { }

  ngOnInit()
  {
    init_plugins();
  }

}
