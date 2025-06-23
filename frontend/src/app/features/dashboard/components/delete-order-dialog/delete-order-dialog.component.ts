import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {AddShipmentModalComponent} from '../add-shipment-modal/add-shipment-modal.component';

@Component({
  selector: 'app-delete-order-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './delete-order-dialog.component.html',
  standalone: true,
  styleUrl: './delete-order-dialog.component.scss'
})
export class DeleteOrderDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<AddShipmentModalComponent>,
  ) {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
