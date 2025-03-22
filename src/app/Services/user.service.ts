import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.urlBlogUocApi, user).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.urlBlogUocApi}/${userId}`, user).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getUserById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.urlBlogUocApi}/${userId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
