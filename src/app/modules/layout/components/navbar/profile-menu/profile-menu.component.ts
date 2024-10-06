import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Theme } from 'src/app/core/models/theme.model';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit {
  theme: Theme = {mode:'', color:'', primary: '', secondary: '', textColor: '' }; // Provide a default value

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.updateColors({ primary: color, secondary: this.theme.secondary, textColor: this.theme.textColor });
  }
}
