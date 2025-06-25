import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Order} from '../../../orders/interfaces/order';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {OrderStatus} from '../../../orders/enum/order-status';

@Component({
  selector: 'app-update-status-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    NgForOf,
    MatSelect,
    NgIf,
    MatButton,
    MatDialogActions,
    MatOption,
    MatDialogTitle,
    MatLabel,
    MatError
  ],
  templateUrl: './update-status-modal.component.html',
  standalone: true,
  styleUrl: './update-status-modal.component.scss'
})
export class UpdateStatusModalComponent {
  form: FormGroup;
  statuses = Object.values(OrderStatus);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
  ) {
    this.form = fb.group({
      order_status: [data.order_status, Validators.required]
    })
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.form.valid) {
      this.data.order_status = this.form.value.order_status;
      this.dialogRef.close(this.data);
    }
  }
}
