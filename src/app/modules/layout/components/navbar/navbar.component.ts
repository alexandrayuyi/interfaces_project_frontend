import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Theme } from 'src/app/core/models/theme.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
        AngularSvgIconModule,
        NavbarMenuComponent,
        NavbarMobileComponent,
    ],
})
export class NavbarComponent implements OnInit {
  theme: Theme = { mode: 'dark', color: 'base', primary: '', secondary: '', muted: '', h1Size: 16, h2Size: 12, pSize: 10 }; // Provide a default value
  constructor(private menuService: MenuService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.applyTheme();
    });
  }

  private applyTheme() {
    // Aplica los cambios de tema al componente
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}
