import { Component, OnDestroy } from '@angular/core';
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
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }

  private loadPosts(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.subscriptions.add(
        this.postService.getPostsByUserId(userId).subscribe({
          next: (posts) => {
            this.posts = posts;
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          }
        })
      );
    }
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
