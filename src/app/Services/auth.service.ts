import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthDTO } from '../Models/auth.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    return this.http.post<AuthToken>(this.urlBlogUocApi, auth).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
