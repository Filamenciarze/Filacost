import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {ShipmentType} from '../../../orders/interfaces/shipment-type';

@Component({
  selector: 'app-add-shipment-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatError,
    MatDialogActions,
    MatButton,
    NgIf,
    MatDialogTitle,
    MatInput,
  ],
  templateUrl: './add-shipment-modal.component.html',
  standalone: true,
  styleUrl: './add-shipment-modal.component.scss'
})
export class AddShipmentModalComponent implements OnInit{
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddShipmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShipmentType
    ) {
    this.form = this.fb.group({
      shipment_type: ['', [Validators.required]],
      shipment_cost: [0.01, [Validators.required, Validators.min(0.01)]],
    })
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        shipment_type: this.data.shipment_type,
        shipment_cost: this.data.shipment_cost,
      })
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value)
      this.dialogRef.close(this.form.value);
    }
  }
}
