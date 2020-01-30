import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IVwActa } from '../../modelo/modelo';
import { ActasService } from '../../services/actas.service';
//import { AllCommunityModules, Module } from '@ag-grid-community/all-modules';

import { TableModule } from 'primeng/table';
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

  constructor(private actaservice: ActasService, private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.lestados = [
      {label: 'Aprobado', value: 'A'},
      {label: 'Ingresado', value: 'I'}
    ];
    this.spinner.show();
    this.actaservice.getActas().subscribe(actas => { this.lista = actas; this.spinner.hide(); /*this.gridApi.sizeColumnsToFit();*/ },
    error => {console.error(error); this.spinner.hide();});
  }

  clickVer(item) {
    this.router.navigate(['/acta/', item.actaId]);
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
