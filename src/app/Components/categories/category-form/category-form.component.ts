import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.loadCategory();
    }
  }

  private loadCategory(): void {
    if (this.categoryId) {
      this.subscriptions.add(
        this.categoryService.getCategoryById(this.categoryId).subscribe({
          next: (category) => {
            this.category = category;
            this.title.setValue(this.category.title);
            this.description.setValue(this.category.description);
            this.css_color.setValue(this.category.css_color);

            this.categoryForm = this.formBuilder.group({
              title: this.title,
              description: this.description,
              css_color: this.css_color,
            });
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          }
        })
      );
    }
  }

  private editCategory(): void {
    if (this.categoryId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.category.userId = userId;
        this.subscriptions.add(
          this.categoryService.updateCategory(this.categoryId, this.category).subscribe({
            next: () => {
              this.sharedService.managementToast('categoryFeedback', true, undefined);
              this.router.navigateByUrl('categories');
            },
            error: (error) => {
              this.sharedService.errorLog(error.error);
              this.sharedService.managementToast('categoryFeedback', false, error.error);
            }
          })
        );
      }
    }
  }

  private createCategory(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.category.userId = userId;
      this.subscriptions.add(
        this.categoryService.createCategory(this.category).subscribe({
          next: () => {
            this.sharedService.managementToast('categoryFeedback', true, undefined);
            this.router.navigateByUrl('categories');
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('categoryFeedback', false, error.error);
          }
        })
      );
    }
  }

  saveCategory(): void {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
