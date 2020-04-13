import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVwActa } from '../modelo/modelo';

@Injectable({
  providedIn: 'root'
})
export class ActasService {

  apiUrl: string;
  //httpOptions = {
  //  headers: new HttpHeaders({
  //    'Content-Type': 'application/json; charset=utf-8'
  //  })
  //};

  constructor(private http: HttpClient) {

    //this.apiUrl = "https://localhost:44311/api/Acta";
    //this.apiUrl = "http://localhost:3000/api/actas";
    //this.apiUrl = "http://localhost:5200/api/Acta";
    this.apiUrl = "http://srvfrm:5200/api/Acta";
  }

  // getActas(): Observable<IVwActa[]> {
  //   return this.http.get<IVwActa[]>(this.apiUrl);
  // }

  getActas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getActasByEstadoSituacion(estados: number[]): Observable<any[]>{
    let params = new HttpParams().set("estados", JSON.stringify(estados));
    return this.http.get<any>(this.apiUrl + '/ByEstadoSituacion/', {params});

  }

  getActa(id): Observable<any>{
    // console.log('servicio:');
    // console.log(id);
    return this.http.get<any>(this.apiUrl + '/' + id);
  }

  insertaActa(pacta): Observable<any>{
    return this.http.post(this.apiUrl, pacta);
  }

  updateActa(pacta): Observable<any> {
    return this.http.put<any>(this.apiUrl, pacta);
  }

  validaActa(id): Observable<any>{
    return this.http.post<any>(this.apiUrl + "/Valida/" + id, null);
  }

  apruebaActa(id: number, usuario: string){
    const headers = {'content-type': 'application/json'}
    let params = new HttpParams().set("usuario", usuario);
    return this.http.post<any>(this.apiUrl + '/Aprueba/' + id, {}, {'headers': headers, 'params': params});
  
  }





}
