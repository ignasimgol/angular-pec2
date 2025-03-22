import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnDestroy {
  categories!: CategoryDTO[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.subscriptions.add(
      this.store.select(selectUserId).subscribe(userId => {
        if (userId) {
          this.categoryService.getCategoriesByUserId(userId).subscribe({
            next: (categories) => {
              this.categories = categories;
            },
            error: (error) => {
              this.sharedService.errorLog(error.error);
            }
          });
        }
      })
    );
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    let result = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      this.subscriptions.add(
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: (response) => {
            if (response.affected > 0) {
              this.loadCategories();
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
