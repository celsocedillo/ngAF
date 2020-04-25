import { Component, OnInit } from '@angular/core';
import { ArchivomigracionService } from '../../services/archivomigracion.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TableModule, Table } from 'primeng/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss']
})
export class ArchivoComponent implements OnInit {

  lista : any[];

  constructor(private archivoService :  ArchivomigracionService,
    private router: Router, 
              private spinner: NgxSpinnerService
             ) { }

  ngOnInit() {
    this.buscarArchivos();
  }

  buscarArchivos(){
    this.spinner.show();
    this.archivoService.getArchivosMigracion().subscribe(archivos => { 
      this.lista = archivos; 
      console.log(this.lista);
      this.spinner.hide(); 
      //this.dt.filter('I', 'estado','in')
    },
    error => {
      console.error(error); 
      this.spinner.hide();
    });

  }

  clickVer(item) {
    this.router.navigate(['/archivo/', item.id]);
  }



}
