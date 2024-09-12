import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  servidor="http://localhost:5000/api/v1/products";
  login="http://localhost:5000/api/v1/auth/login";

  constructor(private servicio:HttpClient) { }

  getProducts():Observable<any>{
    const data = this.servicio.get(this.servidor);
    return data;
  }

  postLogin(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.servicio.post(this.login, data);
  }
  postRegister(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.servicio.post(this.login, data);
  }
}
