import {Component, OnInit} from '@angular/core';
import {Profile} from '../../interfaces/profile';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileService} from '../../services/profile.service';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgForOf, NgIf} from '@angular/common';
import {ProfileAddDialogComponent} from '../../components/profile-add-dialog/profile-add-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Address} from '../../interfaces/address';
import {AddressAddDialogComponent} from '../../components/address-add-dialog/address-add-dialog.component';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-profile-details',
  imports: [
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatProgressSpinner,
    NgIf,
    MatCardActions,
    MatButton,
    MatCardHeader,
    NgForOf,
    MatDivider,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './profile-details.component.html',
  standalone: true,
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnInit {

  profile: Profile = {} as Profile;
  loading = true;
  protected addresses: Address[] = [];

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.loadAddresses();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data: Profile) => {
        this.profile = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load profile.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadAddresses(): void {
    this.profileService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: () => {
        this.snackBar.open('Failed to load addresses.', 'Close', { duration: 3000 });
      }
    });
  }
  openAddProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileAddDialogComponent, {
      width: '400px',
      data: { profile: this.profile }  // przekazujemy aktualny profil
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.profile) {
          this.updateProfile(result);
        } else {
          this.createProfile(result);
        }
      }
    });
  }
  openAddAddressDialog(): void {
    const dialogRef = this.dialog.open(AddressAddDialogComponent, {
      width: '500px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAddresses();
      }
    });
  }

  editAddress(address: Address): void {
    const dialogRef = this.dialog.open(AddressAddDialogComponent, {
      width: '500px',
      disableClose: true,
      data: address
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAddresses();
      }
    });
  }


  deleteAddress(address: Address): void {
    this.profileService.deleteAddress(address.address_id).subscribe({
        next: () => {
          this.snackBar.open('Address deleted successfully.', 'Close', { duration: 3000 });
          this.loadAddresses();
        },
        error: () => {
          this.snackBar.open('Failed to delete address.', 'Close', { duration: 3000 });
        }
      });
    }

  createProfile(profileData: any) {
    this.profileService.updateProfile(profileData).subscribe(response => {
      this.loadProfile(); // załaduj na nowo dane
    });
  }

  updateProfile(profileData: any) {
    this.profileService.updateProfile(profileData).subscribe(response => {
      this.loadProfile(); // załaduj na nowo dane
    });
  }
}
