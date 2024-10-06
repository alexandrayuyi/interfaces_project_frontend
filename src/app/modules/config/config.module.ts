import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';
import { FooterComponent } from "../layout/components/footer/footer.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { BottomNavbarComponent } from "../layout/components/bottom-navbar/bottom-navbar.component";
import { ButtonComponent } from "../../shared/components/button/button.component";

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    ReactiveFormsModule,
    LayoutModule,
    FooterComponent,
    AutoCompleteModule,
    FormsModule,
    BottomNavbarComponent,
    ButtonComponent
  ]
})
export class ConfigModule { }
