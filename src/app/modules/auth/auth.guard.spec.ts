import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate de tener un servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token) {
      return true; // Permitir acceso si hay token
    } else {
      this.router.navigate(['/login']); // Redirigir a login si no hay token
      return false;
    }
  }
}
