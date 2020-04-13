import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ActasService } from '../../../services/actas.service';
import { VwactivosService} from '../../../services/vwactivos.service';
import { OtrosService} from '../../../services/otros.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import {ConfirmationService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import { NgxSpinnerService } from "ngx-spinner";
import { error } from 'protractor';
import { Table } from 'primeng/table/table';


@Component({
  selector: 'app-actaform',
  templateUrl: './actaform.component.html',
  styleUrls: ['./actaform.component.scss']
})
export class ActaformComponent implements OnInit {

  @ViewChild('tact', {static: false}) tAct: ElementRef;
  @ViewChild('textoBuscar', {static: false}) textoBuscar: ElementRef;

  id: string;
  acta :any;
  frmActa : FormGroup;
  lstEstadosSituacion = [];
  modoEdicion : boolean = false;
  msgs: Message[] = [];
  display : boolean = false;
  display2 : boolean = false;
  lActivosCoincidencia : any[];
  activoSeleccionado: any;
  activosFiltrados: any[];
  acti: string;
  actiFil: {'ZZZZZZ', 'SSSSSSS','RRRRRRR','TTTTTTT'};
  listaActivos = ["MOBILIARIO", "MAQUINARIA", "MAQUINARIA", "MAQUINARIA", "EQUIPOS, SISTEMAS Y PAQUETES", "MOBILIARIO", "RADIOS Y EXTINTORES", "MOBILIARIO", "EQUIPOS, SISTEMAS Y PAQUETES", "EQUIPOS, SISTEMAS Y PAQUETES", "CELSO","CEDILLO"];
  filActi: any[];
  activosSeleccionados: any[] = [];
  listaActivosBorrar: any[] = [];
  lstbd : [];
  dlgAprobar: boolean;
  msgAprobacion: string;
  lstActivosValidar : any[];
  xResultadoValidacion: string;
  actaAprobar: string;


constructor(private activatedRoute: ActivatedRoute, 
            private actaservice: ActasService, 
            private vwactivoservice: VwactivosService,
            private otrosService: OtrosService,
            private router: Router,
            private fb: FormBuilder,
            private messageService: MessageService,
            private spinner: NgxSpinnerService,
            private focusMonitor: FocusMonitor,
            private confirmationService: ConfirmationService,              
            private domelem: ElementRef) {

}

ngOnInit() {

  this.actaAprobar = localStorage.getItem('aprobar');

  this.frmActa = new FormGroup({
    id: new FormControl(),
    numeroActa: new FormControl('', Validators.required),
    fechaActa : new FormControl('', Validators.required),
    comentarios :new FormControl('', Validators.required),
    estadoInicialId: new FormControl(),
    estadoFinalId : new FormControl(),
    estado: new FormControl()
  });


  this.otrosService.findEstadosSituacionByUsuario('ACARABAJO').subscribe(res =>   { 
    res.forEach(element =>  {
     this.lstEstadosSituacion.push({value: element.estadoOrigenId, name: element.EstadoOrigen.descripcion});
   });
   this.configuraActa();
  });
}

configuraActa(){
  this.activatedRoute.params.subscribe(paramsId => {
    if (paramsId["id"] != undefined){
      this.id = paramsId.id;
      this.modoEdicion = true;
      this.buscaActa(this.id);  
    }else{
      this.acta = {
        actaId : null,
        fechaActa : null,
        numeroActa : '',
        comentarios : '',
        estadoInicialId : this.lstEstadosSituacion[0].value,
        estadoFinalId : this.lstEstadosSituacion[0].value,
        usuarioIngresa : null,
        usuarioAprueba : '',
        usuarioSupervisa : '',
        fechaAprueba : null,
        fechaIngresa : null,
        estado : "I",
        numeroActivos : 0,
        totalValor : 0,
        actaCompensacion : null,
        actaIdReferencia :null
      }
      this.frmActa.patchValue({estadoInicialId: this.acta.estadoInicialId, estadoFinalId : this.acta.estadoFinalId});
    }
  });
}

buscaActa(id){
  this.spinner.show("spForm");
  this.actaservice.getActa(id).subscribe(ret => {
    this.acta = ret;
    this.llenaDatos();
    this.spinner.hide("spForm");
  });
}

grabar(){
  if (this.validar()){
    console.log('fecha');
    console.log(this.frmActa.get('fechaActa').value);

    let registro = {
      id : this.frmActa.get('id').value,
      //Le agrego una hora, por que al guardar en la base de datos, me guardaba la fecha con un dia menos
      //fechaActa : new Date(this.frmActa.get('fechaActa').value + 'T12:00:00'),
      fechaActa : (this.frmActa.get('fechaActa').value),
      numeroActa : this.frmActa.get('numeroActa').value,
      comentarios : this.frmActa.get('comentarios').value,
      estadoInicialId : this.frmActa.get('estadoInicialId').value,
      estadoFinalId : this.frmActa.get('estadoFinalId').value,
      usuarioIngresa : this.acta.usuarioIngresa,
      fechaIngresa : this.acta.fechaIngresa,
      usuarioAprueba : this.acta.usuarioAprueba,
      usuarioSupervisa : this.acta.usuarioSupervisa,
      fechaAprueba : this.acta.fechaAprueba,
      estado : this.acta.estado,
      numeroActivos : this.acta.numeroActivos,
      totalValor : this.acta.totalValor,
      actaCompensacion : this.acta.actaCompensacion,
      actaIdReferencia : this.acta.actaIdReferencia
    }
    //Si se esta editando un registro existente, entonces se hace un update
    this.spinner.show("spForm");
    if (this.modoEdicion){
      this.acta.Detalle.push.apply(this.acta.Detalle, this.listaActivosBorrar);
      Object.assign(registro, {Detalle: this.acta.Detalle});
      console.log(registro);
      this.actaservice.updateActa(registro).subscribe(resp => {
        this.listaActivosBorrar = [];
        this.buscaActa(registro.id);
        //this.msgs = [];
        //this.msgs.push({severity: 'info', summary: '', detail:'Datos grabados '});
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
      //registro.fechaActa = Date.parse(this.frmActa.get('fechaActa').value);
      registro.fechaIngresa = new Date();
      registro.usuarioIngresa = localStorage.getItem('usuario');
      registro.estado = "I";
      registro.numeroActivos = 0;
      registro.totalValor = 0;
      this.actaservice.insertaActa(registro).subscribe(resp => {
        this.modoEdicion = true;
        //this.msgs = [];
        //this.msgs.push({severity: 'info', summary: '', detail:'Datos grabados '});
        this.messageService.add({severity:'info', summary: 'Grabar', detail:'Datos grabados', life: 12000});
        this.acta = resp.acta;
        //this.acta.fechaActa = Date.parse(this.acta.fechaActa);
        Object.assign(this.acta, {Detalle: []});
        this.llenaDatos();
        this.spinner.hide("spForm");
      }, 
      error => {
        console.log('Error en insert act => ');
        console.log(error); 
        this.spinner.hide("spForm");
        this.messageService.clear();
        this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al crear el acta', detail:error.error.error.message});
      });    
    }
  }

}

cancelar(){
  this.router.navigate(['/actas']);
}

validaActa(){
  this.spinner.show("spForm");
  this.actaservice.validaActa(this.acta.id).subscribe(resp => {
    this.spinner.hide("spForm");
    this.dlgAprobar = true;
    if (resp.respuesta.implicitResults[0].length > 0){
      this.lstActivosValidar = resp.respuesta.implicitResults[0];
      this.xResultadoValidacion = "N";
    }else{
      this.xResultadoValidacion = "V";
    }
    
    
    this.spinner.hide("spForm");
  }, 
  error => {
    this.spinner.hide("spForm");
    console.log('error de validacion');
    console.log(error);
    this.dlgAprobar = true;
    this.xResultadoValidacion = "E";
    this.msgAprobacion = error.error.error;
  });    

}

apruebaActa(){
  this.spinner.show("spForm");
  this.actaservice.apruebaActa(this.acta.id,localStorage.getItem('usuario')).subscribe(resp => {
    this.dlgAprobar = false;
    this.modoEdicion = false;
    this.buscaActa(this.acta.id);
    this.spinner.hide("spForm");
    this.messageService.add({severity:'success', summary: 'Aprobar', detail:'Acta aprobada', life: 12000});
  }, 
  error => {
    this.spinner.hide("spForm");
    console.log('error de validacion');
    console.log(error);
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'error', summary:'Error al crear el acta', detail:error.error.error.message});
});    

}

validar(){
  if (this.frmActa.get('estadoInicialId').value == this.frmActa.get('estadoFinalId').value){
    this.messageService.add({severity:'error', summary: 'Advertencia', detail:'El estado inicial no puede ser igual al estado final', life: 18000});
    return false;
  }
  return true;
}

llenaDatos(){
  var dp = new DatePipe('es-EC');
  var format = "yyyy-MM-dd";
  console.log(dp.transform(this.acta.fechaActa,format));
  this.frmActa.patchValue({
    id: this.acta.id,
    numeroActa: this.acta.numeroActa,
    fechaActa: dp.transform(this.acta.fechaActa,format),
    comentarios: this.acta.comentarios,
    estadoInicialId: this.acta.estadoInicialId,
    estadoFinalId: this.acta.estadoFinalId
  });
  console.log(this.frmActa);
}

showDialog() {
  this.display2 = true;
  this.lActivosCoincidencia = null;
  let tinp = this.textoBuscar.nativeElement;
  tinp.focus();
}

buscarCoincidencias(textoBuscar : string){
  this.spinner.show("spBusqueda");
  this.vwactivoservice.findActivos(textoBuscar, {idEstadoSituacion: this.frmActa.get('estadoInicialId').value}).subscribe(resp => {this.lActivosCoincidencia = resp; this.spinner.hide("spBusqueda");}, error => console.log(error));
  //console.log(this.lActivosCoincidencia);
}

bajar(event){
  console.log('key'+ event.key);
  if (event.key === "ArrowDown"){
    let tabele = this.domelem.nativeElement.querySelectorAll('.ui-selectable-row');
    let trow = tabele[0];
    trow.focus();
    console.log(trow);
    console.log('tabla');
  }
}

onFocus(){
  console.log("text focus");
}

onSelect(event){
  if (!this.acta.actaDetalle.find( ({activoId}) => activoId === this.activoSeleccionado.idActivo)){
    this.acta.actaDetalle.push({activoId: this.activoSeleccionado.idActivo,
      usuarioIngresa: 'CCEDILLO',
      estado: "N",
      descripcion: this.activoSeleccionado.descripcion,
      codigoEcapag: this.activoSeleccionado.codigoEcapag,
      codigoConcesionaria: this.activoSeleccionado.codigoConcesionaria,
      codigoActivoControl: this.activoSeleccionado.codigoActivoControl,
      tipoActivo : this.activoSeleccionado.tipoActivo,
      claseActivo: this.activoSeleccionado.claseActivo,
      valorCompraIva: this.activoSeleccionado.valocCompra + this.activoSeleccionado.valorIva
    });
    this.textoBuscar.nativeElement.focus();
    this.lActivosCoincidencia = null;
  }
}

filtrarActivo(event){
      let query = event.query;
      this.vwactivoservice.findActivos(query, {idEstadoSituacion: this.frmActa.get('estadoInicialId').value})
      .subscribe(resp => {
        this.lActivosCoincidencia = resp;
      }, error => console.log(error));    
}

agregarActivo(){
  
  if (!this.acta.Detalle.find( ({activoId}) => activoId === this.activoSeleccionado.id)){
    this.acta.Detalle.push({
      actaId: this.acta.id,
      activoId: this.activoSeleccionado.id,
      usuarioIngresa: localStorage.getItem('usuario'),
      codigo: (this.activoSeleccionado.codEcapag == null ? (this.activoSeleccionado.codActControl==null ? this.activoSeleccionado.codConces : this.activoSeleccionado.codActControl)  : this.activoSeleccionado.codEcapag) ,
      estado: "I",Activo: {
        descripcion: this.activoSeleccionado.descripcion,
        codigoEcapag: this.activoSeleccionado.codEcapag,
        codigoConcesionaria: this.activoSeleccionado.codConces,
        codigoActivoControl: this.activoSeleccionado.codActControl,
        tipoActivo : this.activoSeleccionado.tipoActivo,
        claseActivo: this.activoSeleccionado.claseActivo,
  
      },
      valorCompraIva: this.activoSeleccionado.valorCompra + (this.activoSeleccionado.valorIva == null ? 0 : this.activoSeleccionado.valorIva)
    });
    this.acta.numeroActivos++;
    this.acta.totalValor += (this.activoSeleccionado.valorCompra + (this.activoSeleccionado.valorIva == null ? 0.00 : this.activoSeleccionado.valorIva));
  }

}

eliminarActivo(){
  if (this.activosSeleccionados.length > 0){
    this.confirmationService.confirm({
      message: 'Seguro desea eliminar los ' + this.activosSeleccionados.length + ' activos seleccionados',
      accept: () =>{
        for  (let item of this.activosSeleccionados ){
          if (item.estado === "A" || item.estado === 'N' || item.estado === 'C') {
            item.estado = 'X';
/*             this.acta.numeroActivos--;
            this.acta.totalValor -= (item.valorCompra + item.valorIva == null ? 0.0 : item.valorIva) ;  
 */            this.listaActivosBorrar.push(item);
          }
          this.acta.Detalle = this.acta.Detalle.filter(borrar => borrar.activoId !== item.activoId);
          this.acta.numeroActivos--;
          console.log(item);
          this.acta.totalValor -= (item.valorCompraIva );
        }
        console.log(this.listaActivosBorrar);
        this.activosSeleccionados = [];
      }
    });
  }
}

onConfirm() {
  this.messageService.clear('c');
}
  
}

