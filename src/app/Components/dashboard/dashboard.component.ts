import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  posts!: PostDTO[];
  numLikes: number = 0;
  numDislikes: number = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.subscriptions.add(
      this.postService.getPosts().subscribe({
        next: (posts) => {
          this.posts = posts;
          // Calculate likes and dislikes after posts are loaded
          this.calculateStats();
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
          this.sharedService.errorLog(error.error);
        }
      })
    );
  }

  private calculateStats(): void {
    // Reset counters before calculation
    this.numLikes = 0;
    this.numDislikes = 0;
    
    // Now it's safe to iterate through posts
    this.posts.forEach((post) => {
      this.numLikes += post.num_likes;
      this.numDislikes += post.num_dislikes;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
