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
  tamanioScroll = 210;
  modoEdicion :boolean = true;
  rowGroupMetadata: any;
  activoSeleccionado: any;


  constructor(private activatedRoute: ActivatedRoute, 
              private router: Router,
              private archivoService: ArchivomigracionService,
              private spinner: NgxSpinnerService  ) { 

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined){
        this.id = params.id;
        this.modoEdicion = false;
        if (window.screen.height > 210){
          if (this.modoEdicion) {this.tamanioScroll = window.screen.height - 560}
          else {this.tamanioScroll = window.screen.height - 460};
        }
        console.log('tamanio :' + this.tamanioScroll);
        this.buscaArchivo(this.id);  
      }
    });
  }


  buscaArchivo(id){
    this.spinner.show("spForm");
    console.log('spiner');
    this.archivoService.getArchivo(id).subscribe(archivo => {
      this.archivo = archivo;
      this.updateRowGroupMetaData();
      console.log(this.rowGroupMetadata);
      this.spinner.hide("spForm");
      console.log('spiner off');
    });

  }

  cancelar(){
    this.router.navigate(['/archivos']);
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.archivo.Detalle) {
        for (let i = 0; i < this.archivo.Detalle.length; i++) {
            let rowData = this.archivo.Detalle[i];
            let subgrupo = rowData.subGrupo;
            let valor = 0;
            if (i == 0) {
                console.log(subgrupo);
                this.rowGroupMetadata[subgrupo] = { index: 0, size: 1, valor : rowData.valorCompra };
                console.log(this.rowGroupMetadata);
            }
            else {
                let previousRowData = this.archivo.Detalle[i - 1];
                let previousRowGroup = previousRowData.subGrupo;
                if (subgrupo === previousRowGroup){
                  this.rowGroupMetadata[subgrupo].size++
                  this.rowGroupMetadata[subgrupo].valor+=rowData.valorCompra;
                }
                else
                    this.rowGroupMetadata[subgrupo] = { index: i, size: 1, valor: rowData.valorCompra };
            }
        }
    }
}
  
}