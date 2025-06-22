import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order-service/order.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Order} from '../../interfaces/order'
import {MatCard, MatCardTitle} from '@angular/material/card';
import {DatePipe, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageableOrder} from '../../interfaces/pageable-order';

@Component({
  selector: 'app-order-list',
  imports: [
    MatCard,
    MatCardTitle,
    NgIf,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    DatePipe
  ],
  templateUrl: './order-list.component.html',
  standalone: true,
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {

  orders: PageableOrder = {} as PageableOrder;
  loading = true;
  displayedColumns: string[] = ['order_id', 'order_status', 'total_cost', 'shipment_type', 'created_at'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log(data)
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load orders.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
