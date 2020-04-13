import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VwactivosService {

  apiUrl: string;

  constructor(private http: HttpClient) { 
    //this.apiUrl = "http://localhost:3000/api/vwactivos";
    //this.apiUrl = "http://localhost:5200/api";
    this.apiUrl = "http://srvfrm:5200/api";
  }

  findActivos(buscar: string, filtro): Observable<any>{
    let params = new HttpParams().set("estadoSituacionId", filtro.idEstadoSituacion);
    return this.http.get<any>(this.apiUrl + '/ActivoByFiltroCodigo/' + buscar, {params});
  }

}
