import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryDTO } from '../Models/category.dto';

interface DeleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlApi = 'http://localhost:3000';
  }

  getCategoriesByUserId(userId: string): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.urlApi}/users/categories/${userId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(`${this.urlApi}/${this.controller}/${categoryId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(`${this.urlApi}/${this.controller}`, category).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updateCategory(categoryId: string, category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.urlApi}/${this.controller}/${categoryId}`, category).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deleteCategory(categoryId: string): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.urlApi}/${this.controller}/${categoryId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
