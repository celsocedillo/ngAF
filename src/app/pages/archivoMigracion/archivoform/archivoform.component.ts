import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { ArchivomigracionService } from '../../../services/archivomigracion.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-archivoform',
  templateUrl: './archivoform.component.html',
  styleUrls: ['./archivoform.component.scss']
})
export class ArchivoformComponent implements OnInit {


  archivo: any;
  id: number;
  constructor(private activatedRoute: ActivatedRoute, 
              private router: Router,
              private archivoService: ArchivomigracionService,
              private spinner: NgxSpinnerService  ) { 

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined){
        this.id = params.id;
        //this.modoEdicion = true;
        this.buscaArchivo(this.id);  
      }
    });
  }


  buscaArchivo(id){
    this.archivoService.getArchivo(id).subscribe(archivo => {
      this.archivo = archivo;
      console.log(this.archivo);

    });

  }




}
