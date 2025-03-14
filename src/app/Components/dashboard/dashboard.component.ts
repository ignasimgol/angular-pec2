import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts!: PostDTO[];

  numLikes: number = 0;
  numDislikes: number = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPosts();

    this.posts.forEach((post) => {
      this.numLikes = this.numLikes + post.num_likes;
      this.numDislikes = this.numDislikes + post.num_dislikes;
    });
  }

  private async loadPosts(): Promise<void> {
    let errorResponse: any;
    try {
      this.posts = await this.postService.getPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }
}
