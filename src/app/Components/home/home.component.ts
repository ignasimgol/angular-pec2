import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  posts!: PostDTO[];
  private subscriptions: Subscription = new Subscription();
  isAuthenticated$: Observable<boolean>;
  
  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private router: Router,
    private store: Store
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.loadPosts();
  }

  ngOnInit(): void {}

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
          this.loadPosts(); // Reload posts to update like count
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
          this.loadPosts(); // Reload posts to update dislike count
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
