import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { AuthState } from '../../../store/auth/auth.state';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnDestroy {
  categories: CategoryDTO[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<{ auth: AuthState }> // Add proper typing
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.subscriptions.add(
      this.store.select(selectUserId).pipe(
        take(1) // Add take(1) to avoid memory leaks
      ).subscribe(userId => {
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
    this.router.navigateByUrl('category-form');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl(`category-form/${categoryId}`);
  }

  deleteCategory(categoryId: string): void {
    this.subscriptions.add(
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.loadCategories();
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
