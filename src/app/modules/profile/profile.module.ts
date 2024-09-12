import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { LayoutModule } from '../layout/layout.module';
import { FooterComponent } from "../layout/components/footer/footer.component";
import { CountrySelectComponent } from './components/country-select/country-select.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { BottomNavbarComponent } from "../layout/components/bottom-navbar/bottom-navbar.component";
import { ButtonComponent } from "../../shared/components/button/button.component";


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
    AutoCompleteModule,
    FormsModule,
    BottomNavbarComponent,
    ButtonComponent
]
})
export class ProfileModule { }
