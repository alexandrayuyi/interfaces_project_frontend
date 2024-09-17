import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'http://localhost:5000/api/v1/profiles/';

  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<any[]> {
    const url = `${this.apiUrl}${id}`;
    return this.http.get<any[]>(url);
  }

  patchProfile(id: number, body: any): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.patch<any>(url, body);
  }
}
