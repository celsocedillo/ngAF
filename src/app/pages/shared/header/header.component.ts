import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() usuario: string;
  
  //usuario : string;
  constructor() {
    //this.usuario = localStorage.getItem("usuario");
    console.log('constructor header');
    console.log('header usuario local ' + localStorage.getItem('usuario'));
    console.log('header usuario app ' + this.usuario);
   }

  ngOnInit() {
    this.usuario = localStorage.getItem("usuario");
    console.log('onInit header');
    console.log('onInit usuario local ' + localStorage.getItem('usuario'));
    console.log('onInit usuario app ' + this.usuario);

    //this.usuario = localStorage.getItem('usuario');
  }

}
