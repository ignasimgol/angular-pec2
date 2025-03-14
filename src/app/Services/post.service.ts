import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostDTO } from '../Models/post.dto';

// Inline interface definitions
interface deleteResponse {
  affected: number;
}

interface updateResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private urlBlogUocApi: string;
  private controller: string;
  private readonly NONE_TYPE = {}; // Define NONE_TYPE as a class property

  constructor(private http: HttpClient) {
    this.controller = 'posts';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(`http://localhost:3000/users/posts/${userId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post).pipe(
      catchError(error => throwError(() => error))
    );
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http.get<PostDTO>(`${this.urlBlogUocApi}/${postId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    return this.http.put<PostDTO>(`${this.urlBlogUocApi}/${postId}`, post).pipe(
      catchError(error => throwError(() => error))
    );
  }

  likePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(`${this.urlBlogUocApi}/like/${postId}`, this.NONE_TYPE).pipe(
      catchError(error => throwError(() => error))
    );
  }

  dislikePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(`${this.urlBlogUocApi}/dislike/${postId}`, this.NONE_TYPE).pipe(
      catchError(error => throwError(() => error))
    );
  }

  deletePost(postId: string): Observable<deleteResponse> {
    return this.http.delete<deleteResponse>(`${this.urlBlogUocApi}/${postId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
