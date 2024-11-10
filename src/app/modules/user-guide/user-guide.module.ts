import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGuideComponent } from './user-guide.component';
import { UserGuideRoutingModule } from './user-guide-routing.module';
import { SidebarComponent } from '../layout/components/sidebar/sidebar.component';
import { NavbarComponent } from '../layout/components/navbar/navbar.component';
import { FooterComponent } from '../layout/components/footer/footer.component';
import { LayoutModule } from '../layout/layout.module';
import { BottomNavbarComponent } from "../layout/components/bottom-navbar/bottom-navbar.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [UserGuideComponent],
  imports: [
    CommonModule,
    UserGuideRoutingModule,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    LayoutModule,
    BottomNavbarComponent,
    PdfViewerModule
  ]
})
export class UserGuideModule { }
