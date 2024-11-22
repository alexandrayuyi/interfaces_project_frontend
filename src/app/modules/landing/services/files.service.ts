import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private apiUrl = 'http://localhost:5000/api/v1/files';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  deleteFile(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getFiles(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  uploadFiles(files: { [key: string]: File[] | File | null }): Observable<any> {
    const formData = new FormData();
    const headers = this.getHeaders();

    if (files['images']) {
      (files['images'] as File[]).forEach(file => formData.append('files', file));
    }
    if (files['audios']) {
      (files['audios'] as File[]).forEach(file => formData.append('files', file));
    }
    if (files['video']) {
      formData.append('files', files['video'] as File);
    }
    if (files['subtitle']) {
      formData.append('files', files['subtitle'] as File);
    }
    if (files['pdf']) {
      formData.append('files', files['pdf'] as File);
    }
    if (files['html']) {
      formData.append('files', files['html'] as File);
    }

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
