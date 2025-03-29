import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AuthState } from '../../store/auth/auth.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  posts: PostDTO[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store<{ auth: AuthState }>, // Add proper typing
    private postService: PostService,
    private sharedService: SharedService
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.subscriptions.add(
      this.postService.getPosts().subscribe({
        next: (posts) => {
          this.posts = posts;
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        }
      })
    );
  }

  like(postId: string): void {
    this.subscriptions.add(
      this.postService.likePost(postId).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        }
      })
    );
  }

  dislike(postId: string): void {
    this.subscriptions.add(
      this.postService.dislikePost(postId).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
