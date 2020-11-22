import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {User} from '../../auth/model/user';
import {AuthService} from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import {AlertService} from '../alert.service';

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

  constructor(
    public accountService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    this.accountService.user.pipe(switchMap(x => this.accountService.getById(x.id))).subscribe((x: User) => this.user = x);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
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
