import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import packageJson from '../../../../../../package.json';
import { MenuService } from '../../services/menu.service';
import { RouterLink } from '@angular/router';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass, NgIf } from '@angular/common';
import { Theme } from 'src/app/core/models/theme.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, AngularSvgIconModule, SidebarMenuComponent, RouterLink],
})
export class SidebarComponent implements OnInit {
  public appJson: any = packageJson;
  theme: Theme = { mode: 'dark', color: 'base', primary: '', secondary: '', textColor: '' }; // Provide a default value

  constructor(public menuService: MenuService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.applyTheme();
    });
  }

  private applyTheme() {
    // Aplica los cambios de tema al componente
  }

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }
}
