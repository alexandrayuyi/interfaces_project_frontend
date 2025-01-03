import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  servidor="http://localhost:5000/api/v1/products";
  login="http://localhost:5000/api/v1/auth/login";
  register="http://localhost:5000/api/v1/auth/register";
  private readonly TOKEN_KEY = 'access_token'; // Llave para el token
  private readonly USER_ID = 'userid'; // Llave para el id del usuario


  constructor(private servicio:HttpClient) { }

  getProducts():Observable<any>{
    const data = this.servicio.get(this.servidor);
    return data;
  }

  postLogin(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.servicio.post(this.login, data);
  }
  postRegister(email: string, password: string, username: string): Observable<any> {
    const data = { email, password, username };
    return this.servicio.post(this.register, data);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  setId(id: string): void {
    localStorage.setItem(this.USER_ID, id);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Devuelve true si hay token
  }
}
