import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
//import { AgGridModule } from '@ag-grid-community/angular';
//import { DataTablesModule} from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { ActasComponent } from './pages/acta/actas.component';

import { ActasService } from './services/actas.service';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ActasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    ListboxModule
    //DataTablesModule
    //AgGridModule.withComponents([])
  ],
  providers: [ActasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
