import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {User} from '../../auth/model/user';
import {AuthService} from '../../auth/auth.service';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import {AlertService} from '../alert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @ViewChild('closeLoginModal') closeLoginModal: ElementRef;
  @ViewChild('closeRegisterModal') closeRegisterModal: ElementRef;
  user: User;
  submitted: boolean;
  loading: boolean;
  loginForm: FormGroup;
  registerForm: FormGroup;
  termsAccepted: boolean;
  basketTotal: any;

  constructor(
    public accountService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    this.accountService.user.pipe(switchMap(x => this.accountService.getById(x.id))).subscribe((x: User) => this.user = x);
    this.basketTotal = this.accountService.basketTotal;
  }

  // tslint:disable-next-line:typedef
  get loginFormControl() {
    return this.loginForm.controls;
  }
  // tslint:disable-next-line:typedef
  get registerFormControl() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])/*, this.emailValidator.bind(this)*/],
      password: ['', Validators.compose([Validators.required, this.patternValidator()])],
      password2: ['', Validators.compose([Validators.required, this.patternValidator()])],
        termsAccepted: [false, Validators.requiredTrue]
    },
      {
        validator: this.matchPassword('password', 'password2'),
   });
  }

  // tslint:disable-next-line:typedef
  async emailValidator(userControl: AbstractControl) {
    console.log(userControl.value);
    const available = await this.accountService.checkUserName(userControl.value);
    return new Promise(resolve => {
      setTimeout(() => {
        if (!available) {
          resolve({ userNameNotAvailable: true });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }



  // tslint:disable-next-line:typedef
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  // tslint:disable-next-line:typedef
  matchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }


  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get login() { return this.loginForm.controls; }
  // tslint:disable-next-line:typedef
  get register() { return this.registerForm.controls; }


  // tslint:disable-next-line:typedef
  logout() {
    this.accountService.logout();
    location.reload();
  }

  onLogin(): void {
    this.submitted = true;

    // this.alertService.clear();

    // stop here if form is invalid
    if (this.login.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login({ email: this.login.email.value, password: this.login.password.value})
      .pipe(first())
      .subscribe({
        next: () => {
          this.closeLoginModal.nativeElement.click();
          this.router.navigateByUrl('/');
          location.reload();
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  onRegister(): void {
    this.submitted = true;

    // this.alertService.clear();

    // stop here if form is invalid
    if (this.register.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.register({ email: this.register.email.value, password: this.register.password.value})
      .pipe(first())
      .subscribe({
        next: () => {
          this.closeRegisterModal.nativeElement.click();
          this.router.navigateByUrl('/');
          location.reload();
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }

}
