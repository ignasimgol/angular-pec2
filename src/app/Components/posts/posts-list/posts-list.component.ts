import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnDestroy {
  posts!: PostDTO[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.subscriptions.add(
      this.store.select(selectUserId).subscribe(userId => {
        if (userId) {
          this.postService.getPostsByUserId(userId).subscribe({
            next: (posts) => {
              this.posts = posts;
            },
            error: (error) => {
              this.sharedService.errorLog(error.error);
            }
          });
        }
      })
    );
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    const result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.subscriptions.add(
        this.postService.deletePost(postId).subscribe({
          next: (response) => {
            if (response.affected > 0) {
              this.loadPosts();
            }
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
