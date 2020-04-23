import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVwActa } from '../modelo/modelo';
import { environment } from './../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ArchivomigracionService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl+'/ArchivoMigracion'
   }


  getArchivosMigracion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getArchivo(id): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/' + id);
  }


}
