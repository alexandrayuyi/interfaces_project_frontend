import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultimediaComponent } from './multimedia.component';
import { ImagesComponent } from './images/images.component';
import { AudiosComponent } from './audios/audios.component';
import { VideoComponent } from './video/video.component';
import { PdfComponent } from './pdf/pdf.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', component: MultimediaComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'audios', component: AudiosComponent },
  { path: 'video', component: VideoComponent },
  { path: 'pdf', component: PdfComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultimediaRoutingModule { }