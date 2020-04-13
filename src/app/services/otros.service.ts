import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OtrosService {

  apiUrl: string;

  constructor(private http: HttpClient) { 
    //this.apiUrl = "http://localhost:3000/api/estadosSituacion";
    //this.apiUrl = "http://localhost:5200/api/OtrosServicios";
    this.apiUrl = "http://srvfrm:5200/api/OtrosServicios";
  }

   findEstadosSituacionByUsuario(pusuario: string): Observable<any>{
    //let params = new HttpParams().set("idEstadoSituacion", filtro.idEstadoSituacion);
    return this.http.get<any>(this.apiUrl + '/EstadoSituacionByUsuario/' + pusuario);
  }

  getPermisoAprobar(pusuario: string): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/PermisoAprobar/' + pusuario)
  }

}
