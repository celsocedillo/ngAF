import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtrosService } from './services/otros.service';
import { HeaderComponent } from './pages/shared/header/header.component';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { CabeceraService} from './services/cabecera.service';
import { environment} from './../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'ClientApp';
  usuario : string;
  @ViewChild(HeaderComponent, {static: false}) cabecera;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private otrosService: OtrosService,
              private cabeceraService: CabeceraService){
    console.log('apiUrl:' + environment.apiUrl);
    localStorage.setItem('alturaVentana', window.screen.height.toString()),
    this.activatedRoute.params.subscribe(params => {
      if (params["usuario"] != undefined){
        localStorage.setItem("usuario", params["usuario"]);
        this.usuario = params["usuario"];
        this.cabeceraService.changeMessage(this.usuario);
        otrosService.getDatosSesion(params["usuario"]).subscribe(resp => {
          this.cabeceraService.changeDatos(resp.datosSesion);
        });
        otrosService.getPermisoAprobar(params["usuario"]).subscribe(resp => {
          let opcionAprobar: boolean = false;
          if (resp.respuesta.length > 0){
            if (resp.respuesta[0].HABILITAR_OPCION == 'S' && resp.respuesta[0].HABILITAR_ROL == 'S'){
              opcionAprobar = true;
            }
          }
          if (opcionAprobar) {
            localStorage.setItem("aprobar", "S");
          }else{
            localStorage.setItem("aprobar", "N");
          }
          this.router.navigate(['/actas']);
        });
      }
    });
  }


  }

