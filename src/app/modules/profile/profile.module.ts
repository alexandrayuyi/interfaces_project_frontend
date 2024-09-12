import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { LayoutModule } from '../layout/layout.module';
import { FooterComponent } from "../layout/components/footer/footer.component";
import { CountrySelectComponent } from './components/country-select/country-select.component';


@NgModule({
  declarations: [
    ProfileComponent,
    CountrySelectComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    LayoutModule,
    FooterComponent,
]
})
export class ProfileModule { }
