import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActasComponent } from './pages/acta/actas.component';

const routes: Routes = [
  { path: 'actas', component: ActasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
