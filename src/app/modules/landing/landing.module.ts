import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { Tangram3dComponent } from './components/tangram3d/tangram3d.component';


@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    ButtonComponent,
    CommonModule,
    LandingRoutingModule,
    Tangram3dComponent
  ]
})
export class LandingModule { }
