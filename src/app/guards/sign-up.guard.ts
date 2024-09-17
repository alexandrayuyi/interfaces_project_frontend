import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.http.get<any[]>('http://localhost:5000/api/v1/users').pipe(
      map((users: any[]) => {
        if (users.length >= 1) {
          this.router.navigate(['auth/sign-in']);
          return false;
        }
        return true;
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
