import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtrosService } from './services/otros.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClientApp';
  usuario : string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private otrosService: OtrosService){
    console.log('constructor app 1');
    
    this.activatedRoute.params.subscribe(params => {
      if (params["usuario"] != undefined){
        console.log('constructor app 2');
        console.log(params["usuario"]);
        localStorage.setItem("usuario", params["usuario"]);
        this.usuario = params["usuario"];
        console.log('usuaario local ' + localStorage.getItem('usuario'));
        console.log('usuaario app ' + this.usuario);
        otrosService.getPermisoAprobar(params["usuario"]).subscribe(resp => {
          console.log('contador');
          console.log(resp.length);
          let opcionAprobar: boolean = false;
          if (resp.respuesta.length > 0){
            console.log(resp[0]);
            if (resp.respuesta[0].HABILITAR_OPCION == 'S' && resp.respuesta[0].HABILITAR_ROL == 'S'){
              opcionAprobar = true;
            }
          }
          if (opcionAprobar) {
            localStorage.setItem("aprobar", "S");
          }else{
            localStorage.setItem("aprobar", "N");
          }
          //console.log(resp);
          this.router.navigate(['/actas']);
        });
        
      }else{
        console.log('Borrando');
        localStorage.clear();
      }
    });
  }


  }

