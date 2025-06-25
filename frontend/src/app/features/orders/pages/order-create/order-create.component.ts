import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Address} from '../../../profile/interfaces/address';
import {ShipmentType} from '../../interfaces/shipment-type';
import {ProfileService} from '../../../profile/services/profile.service';
import {OrderService} from '../../services/order-service/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CartService} from '../../services/cart-service/cart.service';
import {CartItem} from '../../interfaces/cart-item';
import {PageableCartItem} from '../../interfaces/pageable-cart-item';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-order-create',
  imports: [
    MatCard,
    MatCardTitle,
    NgIf,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    NgForOf,
    CurrencyPipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
  ],
  templateUrl: './order-create.component.html',
  standalone: true,
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent implements OnInit {

  orderForm!: FormGroup;
  addresses: Address[] = [];
  shipmentTypes: ShipmentType[] = [];
  cartItems: PageableCartItem = {} as PageableCartItem;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private orderService: OrderService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      shipping_address_id: ['', Validators.required],
      shipment_type_id: ['', Validators.required]
    });

    this.loadFormData();
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.cartList().subscribe({
      next: (data) => {
        this.cartItems = data;
      },
      error: () => {
        this.snackBar.open('Failed to load cart items.', 'Close', { duration: 3000 });
      }
    });
  }


  loadFormData(): void {
    this.profileService.getAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load addresses.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });

    // Zakładam że masz endpoint getShipmentTypes():
    this.orderService.getShipmentTypes().subscribe({
      next: (data) => {
        this.shipmentTypes = data;
      },
      error: () => {
        this.snackBar.open('Failed to load shipment types.', 'Close', { duration: 3000 });
      }
    });
  }

  submitOrder(): void {
    if (this.orderForm.invalid) return;

    this.orderService.createOrder(this.orderForm.value).subscribe({
      next: () => {
        this.snackBar.open('Order created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.snackBar.open('Failed to create order.', 'Close', { duration: 3000 });
      }
    });
  }
}
