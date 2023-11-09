import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://127.0.0.1:8080/auth/';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      API_URL + 'signin',
      { username, password }, httpOptions
    );
  }

  signout(): Observable<any> {
    return this.http.post(
      API_URL + 'signout',
      {}, httpOptions
    );
  }
}
