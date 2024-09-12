import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
    imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot(),NavbarComponent,SidebarComponent,FooterComponent],
    exports: [NavbarComponent, SidebarComponent], // Export components
    providers: [provideHttpClient(withInterceptorsFromDi())]
  })
  export class LayoutModule {}
