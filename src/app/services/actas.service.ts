import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    this.apiUrl = "http://localhost:3000/api/actas";
  }

  // getActas(): Observable<IVwActa[]> {
  //   return this.http.get<IVwActa[]>(this.apiUrl);
  // }

  getActas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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

}
