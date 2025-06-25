import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../services/profile.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Address} from '../../interfaces/address';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-address-add-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatError,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatLabel,
  ],
  templateUrl: './address-add-dialog.component.html',
  standalone: true,
  styleUrl: './address-add-dialog.component.scss'
})
export class AddressAddDialogComponent implements OnInit {

  addressForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddressAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address | null
  ) {

    this.addressForm = this.fb.group({
      street_number: [this.data?.street_number ?? '', Validators.required],
      street: [this.data?.street ?? '', Validators.required],
      zipcode: [this.data?.zipcode ?? '', [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{3}$/)]],
      city: [this.data?.city ?? '', Validators.required],
      state: [this.data?.state ?? '', Validators.required],
      country: [this.data?.country ?? '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!this.data;
  }

  onSubmit(): void {
    if (this.addressForm.invalid) return;

    this.loading = true;
    const addressData: Address = {
      ...this.addressForm.value,
      address_id: this.data?.address_id ?? null
    };

    if (this.isEditMode && addressData.address_id) {
      // EDIT
      this.profileService.updateAddress(addressData).subscribe({
        next: () => {
          this.snackBar.open('Address updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to update address.', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // ADD
      this.profileService.addAddress(addressData).subscribe({
        next: () => {
          this.snackBar.open('Address saved successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Failed to save address.', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
