import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit, OnDestroy {
  post: PostDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  num_likes!: UntypedFormControl;
  num_dislikes!: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories!: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;
  private subscriptions: Subscription = new Subscription();

  categoriesList!: CategoryDTO[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.publication_date = new UntypedFormControl(
      formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.num_likes = new UntypedFormControl(this.post.num_likes);
    this.num_dislikes = new UntypedFormControl(this.post.num_dislikes);

    this.categories = new UntypedFormControl([]);

    // get categories by user and load multi select
    this.loadCategories();

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
      num_likes: this.num_likes,
      num_dislikes: this.num_dislikes,
    });
  }

  private loadCategories(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.subscriptions.add(
        this.categoryService.getCategoriesByUserId(userId).subscribe({
          next: (categories) => {
            this.categoriesList = categories;
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          }
        })
      );
    }
  }

  ngOnInit(): void {
    let errorResponse: any;
    // update
    if (this.postId) {
      this.isUpdateMode = true;
      this.loadPost();
    }
  }

  private editPost(): void {
    if (this.postId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.post.userId = userId;
        this.subscriptions.add(
          this.postService.updatePost(this.postId, this.post).pipe(
            catchError(error => {
              this.sharedService.errorLog(error.error);
              throw error;
            })
          ).subscribe({
            next: () => {
              this.sharedService.managementToast('postFeedback', true, undefined);
              this.router.navigateByUrl('posts');
            },
            error: (error) => {
              this.sharedService.managementToast('postFeedback', false, error.error);
            }
          })
        );
      }
    }
  }

  private createPost(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.post.userId = userId;
      this.subscriptions.add(
        this.postService.createPost(this.post).pipe(
          catchError(error => {
            this.sharedService.errorLog(error.error);
            throw error;
          })
        ).subscribe({
          next: () => {
            this.sharedService.managementToast('postFeedback', true, undefined);
            this.router.navigateByUrl('posts');
          },
          error: (error) => {
            this.sharedService.managementToast('postFeedback', false, error.error);
          }
        })
      );
    }
  }

  savePost(): void {
    this.isValidForm = false;
  
    if (this.postForm.invalid) {
      return;
    }
  
    this.isValidForm = true;
    this.post = this.postForm.value;
  
    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createPost();
    }
  }

  loadPost(): void {
    if (this.postId) {
      this.subscriptions.add(
        this.postService.getPostById(this.postId).subscribe({
          next: (post) => {
            this.post = post;
            
            this.title.setValue(this.post.title);
            this.description.setValue(this.post.description);
            this.publication_date.setValue(
              formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
            );

            let categoriesIds: string[] = [];
            this.post.categories.forEach((cat: CategoryDTO) => {
              categoriesIds.push(cat.categoryId);
            });

            this.categories.setValue(categoriesIds);
            this.num_likes.setValue(this.post.num_likes);
            this.num_dislikes.setValue(this.post.num_dislikes);

            this.postForm = this.formBuilder.group({
              title: this.title,
              description: this.description,
              publication_date: this.publication_date,
              categories: this.categories,
              num_likes: this.num_likes,
              num_dislikes: this.num_dislikes,
            });
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
