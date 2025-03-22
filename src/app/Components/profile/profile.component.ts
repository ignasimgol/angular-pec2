import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserDTO } from 'src/app/Models/user.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { selectUserId } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  profileUser: UserDTO;

  name: UntypedFormControl;
  surname_1: UntypedFormControl;
  surname_2: UntypedFormControl;
  alias: UntypedFormControl;
  birth_date: UntypedFormControl;
  email: UntypedFormControl;
  password: UntypedFormControl;

  profileForm: UntypedFormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.profileUser = new UserDTO('', '', '', '', new Date(), '', '');

    this.isValidForm = null;

    this.name = new UntypedFormControl(this.profileUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.surname_1 = new UntypedFormControl(this.profileUser.surname_1, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.surname_2 = new UntypedFormControl(this.profileUser.surname_2, [
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.alias = new UntypedFormControl(this.profileUser.alias, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.birth_date = new UntypedFormControl(
      formatDate(this.profileUser.birth_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.email = new UntypedFormControl(this.profileUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl(this.profileUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectUserId).subscribe(userId => {
        if (userId) {
          this.userService.getUserById(userId).pipe(
            tap((userData) => {
              this.name.setValue(userData.name);
              this.surname_1.setValue(userData.surname_1);
              this.surname_2.setValue(userData.surname_2);
              this.alias.setValue(userData.alias);
              this.birth_date.setValue(
                formatDate(userData.birth_date, 'yyyy-MM-dd', 'en')
              );
              this.email.setValue(userData.email);

              this.profileForm = this.formBuilder.group({
                name: this.name,
                surname_1: this.surname_1,
                surname_2: this.surname_2,
                alias: this.alias,
                birth_date: this.birth_date,
                email: this.email,
                password: this.password,
              });
            }),
            catchError((error) => {
              this.sharedService.errorLog(error.error);
              return of(null);
            })
          ).subscribe();
        }
      })
    );
  }

  updateUser(): void {
    this.isValidForm = false;
    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    this.subscriptions.add(
      this.store.select(selectUserId).subscribe(userId => {
        if (userId) {
          this.userService.updateUser(userId, this.profileUser).pipe(
            tap(() => {
              this.sharedService.managementToast('profileFeedback', true);
            }),
            catchError((error) => {
              this.sharedService.errorLog(error.error);
              this.sharedService.managementToast('profileFeedback', false, error.error);
              return of(null);
            })
          ).subscribe();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
