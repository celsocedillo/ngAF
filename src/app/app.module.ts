import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es-EC';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
//import { AgGridModule } from '@ag-grid-community/angular';
//import { DataTablesModule} from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { ActasComponent } from './pages/acta/actas.component';

import { ActasService } from './services/actas.service';
import { VwactivosService } from './services/vwactivos.service';
import { OtrosService } from './services/otros.service';

import { MomentModule } from 'ngx-moment';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { NgxSpinnerModule } from "ngx-spinner";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';


import { ActaformComponent } from './pages/acta/actaform/actaform.component';

registerLocaleData(es, 'es-EC');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ActasComponent,
    ActaformComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    ListboxModule,
    MessagesModule,
    MessageModule,
    NgxSpinnerModule,
    DialogModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    ToastModule,
    CalendarModule,
    MomentModule.forRoot({relativeTimeThresholdOptions:{ 'm':59}})
    //DataTablesModule
    //AgGridModule.withComponents([])
  ],
  providers: [
    ActasService,
    VwactivosService,
    OtrosService,
    MessageService,
    ConfirmationService,
    {provide: LOCALE_ID, useValue: "es-EC"}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
