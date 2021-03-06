import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActasComponent } from './pages/acta/actas.component';
import { ActaformComponent } from './pages/acta/actaform/actaform.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'init/:usuario', component: AppComponent},
  { path: 'actas', component: ActasComponent },
  { path: 'acta', component: ActaformComponent},
  { path: 'acta/:id', component: ActaformComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
