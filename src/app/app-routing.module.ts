import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then(m => m.HomeRoutes)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.routes').then(m => m.AboutRoutes)
  },
  {
    path: 'project',
    loadChildren: () => import('./pages/project/project.routes').then(m => m.ProjectRoutes)
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.routes').then(m => m.BlogRoutes)
  },
  {
    path: 'uses',
    loadChildren: () => import('./pages/use/use.routes').then(m => m.UseRoutes)
  },
  {
    path: '**', pathMatch: 'full',
    loadChildren: () => import('./pages/error/error.routes').then(m => m.ErrorRoutes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  { path: 'profile', loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'landing', loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule) },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
