import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {PrintMaterial} from '../../../models/enums/print-material';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {CartService} from '../../services/cart-service/cart.service';

export interface AddToCartData {
  print_id: string;
  filename_display: string;
  print_cost: number;
}

@Component({
  selector: 'app-add-cart-dialog',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatInput,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './add-cart-dialog.component.html',
  standalone: true,
  styleUrl: './add-cart-dialog.component.scss'
})
export class AddCartDialogComponent {
  form: FormGroup;
  materials = Object.values(PrintMaterial);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddToCartData,
    private cartService: CartService
  ) {
    this.form = fb.group({
      material: [PrintMaterial.PLA, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    })
  }
  submit() {
    if(this.form.valid) {
      this.cartService.addToCart(this.data.print_id, this.form.value.material, this.form.value.quantity).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => {

        }
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
