import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileReadonlyComponent } from './profile-readonly/profile-readonly.component'; // Importa el nuevo componente

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'readonly', component: ProfileReadonlyComponent } // Nueva ruta para el componente de solo lectura
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
