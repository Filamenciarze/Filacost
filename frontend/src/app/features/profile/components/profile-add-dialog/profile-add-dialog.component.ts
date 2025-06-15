import {Component, Inject, OnInit} from '@angular/core';
import {Profile} from '../../interfaces/profile';
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
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile-add-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatLabel
  ],
  templateUrl: './profile-add-dialog.component.html',
  standalone: true,
  styleUrl: './profile-add-dialog.component.scss'
})
export class ProfileAddDialogComponent implements OnInit {

  profileForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      phone_number: ['']
    });
  }

  ngOnInit(): void {
    if (this.data?.profile) {
      this.profileForm.patchValue(this.data.profile);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.dialogRef.close(this.profileForm.value);
    }
  }
}
