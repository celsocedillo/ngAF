import { Component, OnInit, Input } from '@angular/core';
import { CabeceraService } from 'src/app/services/cabecera.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usuario: string;
  datosSesion: {};
  
  constructor(private cabeceraservice: CabeceraService) {

   }

  ngOnInit() {
    this.cabeceraservice.currentMessage.subscribe(message => this.usuario = message)
    this.cabeceraservice.currentDatos.subscribe(datos => this.datosSesion = datos);
    this.usuario = localStorage.getItem("usuario");
  }

}
