import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { ArchivomigracionService } from '../../../services/archivomigracion.service';

import { NgxSpinnerService } from "ngx-spinner";
import { VwactivosService } from 'src/app/services/vwactivos.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';



@Component({
  selector: 'app-archivoform',
  templateUrl: './archivoform.component.html',
  styleUrls: ['./archivoform.component.scss']
})
export class ArchivoformComponent implements OnInit {

  frmArchivo : FormGroup;
  archivo: any;
  id: number;
  tamanioScroll = 210;
  modoEdicion :boolean = false;
  rowGroupMetadata: any;
  activoSeleccionado: any;
  displayModal :boolean = false;
  vistaActivo: any;
  activoEma: any[] = [];
  lstBorrar : any[] = [];

  constructor(private activatedRoute: ActivatedRoute, 
              private router: Router,
              private archivoService: ArchivomigracionService,
              private messageService: MessageService,
              private spinner: NgxSpinnerService,
              private confirmationService: ConfirmationService,              
              private activoService: VwactivosService  ) { 

  }

  ngOnInit() {

    this.frmArchivo = new FormGroup({
      id: new FormControl(),
      archivo: new FormControl('', Validators.required),
      observacion :new FormControl('', Validators.required)
      //migrado: new FormControl()
    });
  
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined){
        this.id = params.id;
        this.modoEdicion = false;
        if (window.screen.height > 210){
          if (this.modoEdicion) {this.tamanioScroll = window.screen.height - 560}
          else {this.tamanioScroll = window.screen.height - 460};
        }
        this.buscaArchivo(this.id);  
      }else{
        this.archivo = {
          archivoId : null,
          archivo: null,
          fechaIngreso: new Date(),
          observacion: '',
          migrado: 'N',
          usuarioIngreso: 'CCEDILLO',
          totalActivos : 0,
          numeroAtivos: 0
        }
        this.frmArchivo.patchValue({fechaIngreso: this.archivo.fechaIngreso});
      }
    });
  }

  buscaArchivo(id){
    this.spinner.show("spForm");
    this.archivoService.getArchivo(id).subscribe(archivo => {
      this.archivo = archivo;
      if (this.archivo.migrado == 'N') this.modoEdicion = true;
      this.frmArchivo.patchValue({
        id: this.archivo.id,
        archivo: this.archivo.archivo,
        observacion: this.archivo.observacion,
        migrado: this.archivo.migrado        
      });
      this.updateRowGroupMetaData();
      this.spinner.hide("spForm");
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
  
  verActivo(activo){
    this.activoEma = [];
    if (activo.activoId){
      this.activoService.getActivoById(activo.activoId).subscribe(activoEma => {
        this.activoEma.push(activoEma);
      });
    }
    this.displayModal = true;
    this.vistaActivo = activo;

  }

  grabar(){
         
      let registro = {
        id : this.frmArchivo.get('id').value,
        archivo : this.frmArchivo.get('archivo').value,
        fechaIngreso: this.archivo.fechaIngreso,
        observacion : this.frmArchivo.get('observacion').value,
        usuarioIngreso: this.archivo.usuarioIngreso,
        migrado: this.archivo.migrado
      }
      //Si se esta editando un registro existente, entonces se hace un update
      this.spinner.show("spForm");
      if (this.modoEdicion){
        this.archivoService.updateArchivoMigracion(registro).subscribe(resp => {
          this.messageService.add({severity:'info', summary: 'Grabar', detail:'Datos grabados', life: 12000});
          this.spinner.hide("spForm");
        },
        error => {
          console.log('Error en update => ');
          console.log(error.error); 
          this.spinner.hide("spForm");
          this.messageService.clear();
          this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al grabar el acta', detail:error.error.error});
        });  
      }
      //Si es un registro nuevo, se hace un insert
      else{
        this.archivoService.insertaArchivoMigracion(registro).subscribe(resp => {
          this.modoEdicion = true;
          this.messageService.add({severity:'info', summary: 'Grabar', detail:'Datos grabados', life: 12000});
          this.archivo = resp.archivo;
          console.log('grabado', this.archivo);
          this.frmArchivo.patchValue({id: this.archivo.id});
          this.spinner.hide("spForm");
        },
        error => {
          //console.log('Error en insert archivo HJ => ');
          console.log(error.error.error); 
          this.spinner.hide("spForm");
          this.messageService.clear();
          this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al crear el acta de archivo', detail:error.error.error});
        });
       
      }
    
  
  }
  
  eliminarGrupo(pgrupo){
    this.confirmationService.confirm({
        message: 'Seguro desea eliminar los activos del grupo ' + pgrupo,
        accept: () =>{
          this.spinner.show("spForm");
          const data = {
            id: this.archivo.id,
            subGrupo: pgrupo,
            size: this.rowGroupMetadata[pgrupo].size,
            valor: this.rowGroupMetadata[pgrupo].valor,
            numeroActivos: this.archivo.numeroActivos,
            totalActivos: this.archivo.totalActivos
          }

          this.archivoService.eliminarGrupo(data).subscribe(resp =>{
            this.archivo.Detalle = this.archivo.Detalle.filter(borrar => borrar.subGrupo !== pgrupo);
            this.archivo.numeroActivos-=this.rowGroupMetadata[pgrupo].size;
            this.archivo.totalActivos-=this.rowGroupMetadata[pgrupo].valor;
            this.updateRowGroupMetaData();
            this.spinner.hide("spForm");
          }, 
            error => {
              console.log(error.error.error); 
              this.spinner.hide("spForm");
              this.messageService.clear();
              this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al eliminar el grupo de activos', detail:error.error.error});
    
          });
/*           for  (let item of this.activosSeleccionados ){
            if (item.estado === "A" || item.estado === 'N' || item.estado === 'C') {
              item.estado = 'X';
               this.listaActivosBorrar.push(item);
            }
            this.acta.Detalle = this.acta.Detalle.filter(borrar => borrar.activoId !== item.activoId);
            this.acta.numeroActivos--;
            console.log(item);
            this.acta.totalValor -= (item.valorCompraIva );
          }
          console.log(this.listaActivosBorrar);
          this.activosSeleccionados = [];
 */        }
    });
    
  }

  eliminarActivos(ptodos: boolean){
    
    if (ptodos){
      //Si queremos borrar todo
      if (this.archivo.Detalle.length > 0){
        this.confirmationService.confirm({
          message: 'Seguro desea eliminar todos los activos',
          accept: () =>{
            this.spinner.show("spForm");
            const data = {
              todos: true,
              id: this.archivo.id
            }
            debugger;
            this.archivoService.eliminarActivos(data).subscribe(resp =>{
              this.archivo.Detalle = [];
              this.archivo.numeroActivos =0;
              this.archivo.totalActivos =0;
              this.updateRowGroupMetaData();
              this.spinner.hide("spForm");
            }, 
              error => {
                console.log(error.error.error); 
                this.spinner.hide("spForm");
                this.messageService.clear();
                this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al eliminar el grupo de activos', detail:error.error.error});
      
            });
         }
        });
      }
    }else{      
      //Solo borra activos seleccionados
      if (this.lstBorrar.length > 0 ){
        this.confirmationService.confirm({
          message: 'Seguro desea eliminar activos seleccionados',
          accept: () =>{
            this.spinner.show("spForm");
            const data = {
              todos: false,
              id: this.archivo.id,
              lstActivos: this.lstBorrar
            }
            
            this.archivoService.eliminarActivos(data).subscribe(resp =>{
              //Actualizar los datos en la pantalla
              let contActivos = 0;
              let acumValor = 0;
              //Borrando los activos de la tabla
              this.lstBorrar.forEach(element => {
                debugger;
                this.archivo.Detalle = this.archivo.Detalle.filter(borrar => borrar.id !== element.id);
                contActivos++;
                acumValor+=element.valorCompra;
              });
              //Actualizando los totales
              this.archivo.numeroActivos -=contActivos;
              this.archivo.totalActivos -=acumValor;
              this.lstBorrar = [];
              this.updateRowGroupMetaData();
              this.spinner.hide("spForm");
            }, 
              error => {
                console.log(error.error.error); 
                this.spinner.hide("spForm");
                this.messageService.clear();
                this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al eliminar el grupo de activos', detail:error.error.error});
      
            });
         }
        });
      }
    }
  }

  onSelectCheck(pactivo, pselected){
    
    if (pselected) {
      this.lstBorrar.push(pactivo);
    }else{
      this.lstBorrar = this.lstBorrar.filter(borrar => borrar.id !== pactivo.id);
    }
    console.log('Lista ', this.lstBorrar );
  }

}
