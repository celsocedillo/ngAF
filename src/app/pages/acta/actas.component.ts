import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IVwActa } from '../../modelo/modelo';
import { ActasService } from '../../services/actas.service';
import { OtrosService } from  '../../services/otros.service';
//import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';

import { TableModule, Table } from 'primeng/table';
import { SelectItem } from 'primeng/api/selectitem';
import {MultiSelectModule} from 'primeng/multiselect';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-actas',
  templateUrl: './actas.component.html',
  styleUrls: ['./actas.component.scss']
})



export class ActasComponent implements OnInit {

  
  lista : any[];
  lestados : SelectItem[];
  selestado : string;
  @Output() headerUsuario = new EventEmitter<string>();
  @ViewChild('dt', {static:false}) dt: Table;
  lestadosSituacion : any[] = [];

  constructor(private actaservice: ActasService, private otrosService : OtrosService,
              private router: Router, 
              private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService) { 
  
  }

  ngOnInit() {
    console.log('ventana size');
    console.log(window.screen.height);
    //Buscar los estados de situacion habilitados para el usuario
    this.otrosService.findEstadosSituacionByUsuario(localStorage.getItem('usuario')).subscribe(res =>   { 
      res.forEach(element =>  {
       this.lestadosSituacion.push(element.estadoOrigenId);
      });
      this.buscarActas();
    });
    this.lestados = [
      {label: 'Aprobado', value: 'A'},
      {label: 'Ingresado', value: 'I'}
    ];
  }

  buscarActas(){
    this.spinner.show();
    this.actaservice.getActasByEstadoSituacion(this.lestadosSituacion).subscribe(actas => { 
      this.lista = actas; this.spinner.hide(); 
      this.dt.filter('I', 'estado','in')
    },
    error => {
      console.error(error); 
      this.spinner.hide();
    });

  }

  clickVer(item) {
    this.router.navigate(['/acta/', item.id]);
  }

  onChange(evento){
    console.log(evento);
    console.log(evento.value.map(a => a.value));
    // evento.filter('I', 'estado','I');
  }

  // autoSizeAll() {
  //   var allColumnIds = [];
  //   this.gridColumnApi.getAllColumns().forEach(function (column) {
  //     allColumnIds.push(column.colId);
  //   });
  //   this.gridColumnApi.autoSizeColumns(allColumnIds);
  // }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   this.gridApi.setDomLayout("autoHeight");
  //   //document.querySelector("#myGrid").style.height = "";
  //   this.gridApi.sizeColumnsToFit();
  //   this.gridApi.resetRowHeights();

  // }


}
