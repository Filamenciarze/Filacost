import {Component, OnInit} from '@angular/core';
import {PageableCartItem} from '../../interfaces/pageable-cart-item';
import {CartService} from '../../services/cart-service/cart.service';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {MatDivider, MatList, MatListItem} from '@angular/material/list';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatLine} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {CartItem} from '../../interfaces/cart-item';
import {DialogRef} from '@angular/cdk/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  imports: [
    NgIf,
    MatList,
    MatListItem,
    NgForOf,
    CurrencyPipe,
    MatProgressSpinner,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDivider,
    MatLine,
    MatIconButton,
    MatIcon,
    MatMiniFabButton
  ],
  templateUrl: './cart-modal.component.html',
  standalone: true,
  styleUrl: './cart-modal.component.scss'
})
export class CartModalComponent implements OnInit {
  cartItems: PageableCartItem = {} as PageableCartItem;
  loading = true;
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private dialogRef: DialogRef<CartModalComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartList().subscribe(items => {
      this.cartItems = items;
      this.loading = false;
      this.totalPrice = this.calculateTotal();

    });
  }

  calculateTotal(): number {
    return this.cartItems.results.reduce((sum, item) => {
      return sum + item.model3d.print_cost * item.quantity;
    }, 0);
  }

  goToCheckout() {
    this.router.navigateByUrl('checkout').then(close)
  }

  close() {
    this.dialogRef.close()
  }

  removeFromCart(cartitem_id: string) {
    this.cartService.deleteFromCart(cartitem_id).subscribe({
      next: value => {
        this.totalPrice -= this.cartItems.results.filter(item => item.cartitem_id == cartitem_id)[0].model3d.print_cost
        this.cartItems.results = this.cartItems.results.filter(item => item.cartitem_id !== cartitem_id);
        this.cartItems.count--;
      },
      error: value => {}
    })
  }

  increaseQuantity(item: any) {
    const newQuantity = item.quantity + 1;
    this.cartService.updateCartItemQuantity(item.cartitem_id, newQuantity).subscribe(() => {
      item.quantity = newQuantity;
      this.updateTotalPrice();
    });
  }

  decreaseQuantity(item: any) {
    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      this.removeFromCart(item.cartitem_id);
    } else {
      this.cartService.updateCartItemQuantity(item.cartitem_id, newQuantity).subscribe(() => {
        item.quantity = newQuantity;
        this.updateTotalPrice();
      });
    }
  }

  updateTotalPrice() {
    this.totalPrice = this.cartItems.results.reduce(
      (sum: number, item: any) => sum + (item.model3d.print_cost * item.quantity),
      0
    );
  }
}
