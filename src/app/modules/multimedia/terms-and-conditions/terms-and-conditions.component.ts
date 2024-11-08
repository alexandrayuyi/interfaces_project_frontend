import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../layout/components/navbar/navbar.component';
import { FooterComponent } from '../../layout/components/footer/footer.component';
import { LayoutModule } from '../../layout/layout.module';
import { BottomNavbarComponent } from "../../layout/components/bottom-navbar/bottom-navbar.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    LayoutModule,
    BottomNavbarComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  constructor(private router: Router) {}

  navigateTo(page: string) {
    this.router.navigate([`/multimedia/${page}`]);
  }
}
