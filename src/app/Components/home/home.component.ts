import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
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
  showButtons: boolean;

  constructor(
    private postService: PostService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.showButtons = false;
    this.loadPosts();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
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
