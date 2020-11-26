import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../shared/alert.service';
import {first, switchMap} from 'rxjs/operators';
import {User} from '../model/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  addressForm: FormGroup;
  @ViewChild('closeAddAddressModal') closeAddAddressModal: ElementRef;
  loading: boolean;
  initialLoading = true;
  user: User;
  constructor(
    public accountService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
    this.initialLoading = true;
    this.accountService.user.pipe(switchMap(x => this.accountService.getById(x.id))).subscribe((x: User) => {
      this.user = x;
      this.fillFormIfEmpty();
      this.initialLoading = false;
    });
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
        username: [this.user?.username, Validators.required],
        firstName: [this.user?.firstName, Validators.required],
        lastName: [this.user?.lastName, Validators.required],
        password: ['']
      }
    );

    this.addressForm = this.fb.group({
        city: ['', Validators.required],
        zip: ['', Validators.required],
        street: ['', Validators.required],
        houseNumber: ['', Validators.required]
      }
    );
  }

  onSaveUser(): void {
    this.loading = true;
    this.accountService.update(this.user.id, this.profileForm.value).pipe(first())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/account');
          location.reload();
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
    this.profileForm.reset();
  }

  onAdd(): void {
    const newAddress = {...this.addressForm.value, active: true};
    if (this.user.address) {
      for (const item of this.user.address) {
        item.active = false;
      }
    } else {
      this.user.address = [];
    }
    this.user.address.push(newAddress);

    this.accountService.update(this.user.id, this.user).pipe(first())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/account');
          this.closeAddAddressModal.nativeElement.click();
          // location.reload();
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
    this.addressForm.reset();
  }

  fillFormIfEmpty(): void {
    if (this.user && !this.profileForm.controls?.email?.value) {
      this.profileForm.patchValue(this.user);
    }
  }

  activate(index: number): void {
    if (this.user.address) {
      for (const item of this.user.address) {
        item.active = false;
      }
    } else {
      this.user.address = [];
    }
    this.user.address[index].active = true;

    this.accountService.update(this.user.id, this.user).pipe(first())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/account');
          this.closeAddAddressModal.nativeElement.click();
          // location.reload();
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
