import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return of(true);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:5000/api/v1/users', { headers }).pipe(
      map(() => {
        this.router.navigate(['/profile']);
        return false;
      }),
      catchError((error) => {
        if (error.status === 401) {
          return of(true);
        }
        return of(false);
      })
    );
  }
}
