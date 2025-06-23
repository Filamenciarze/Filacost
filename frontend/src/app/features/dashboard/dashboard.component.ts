import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {ShipmentService} from './services/shipment/shipment.service';
import {ShipmentType} from '../orders/interfaces/shipment-type';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {AddShipmentModalComponent} from './components/add-shipment-modal/add-shipment-modal.component';
import {OrderManagementService} from './services/order-management/order-management.service';
import {PageableOrder} from '../orders/interfaces/pageable-order';
import {Order} from '../orders/interfaces/order';
import {UpdateStatusModalComponent} from './components/update-status-modal/update-status-modal.component';
import {DeleteOrderDialogComponent} from './components/delete-order-dialog/delete-order-dialog.component';

enum DashboardElements {
  ORDERS = "orders",
  SALES = "sales",
  SETTINGS = "settings",
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgTemplateOutlet,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    CurrencyPipe,
    DatePipe,
    NgIf,
    NgForOf
  ]
})
export class DashboardComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild('orders', { static: true }) ordersTemplate!: TemplateRef<any>;
  @ViewChild('settings', { static: true }) settingsTemplate!: TemplateRef<any>;
  @ViewChild('sales', { static: true }) salesTemplate!: TemplateRef<any>
  @ViewChild('defaultTemplate', { static: true }) defaultTemplate!: TemplateRef<any>;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Orders', cols: 2, rows: 1, type: DashboardElements.ORDERS },
          { title: 'Sales', cols: 2, rows: 1, type: DashboardElements.SALES },
          { title: 'Settings', cols: 2, rows: 1, type: DashboardElements.SETTINGS },
        ];
      }

      return [
        { title: 'Orders', cols: 2, rows: 1, type: DashboardElements.ORDERS },
        { title: 'Sales', cols: 1, rows: 2, type: DashboardElements.SALES },
        { title: 'Settings', cols: 1, rows: 2, type: DashboardElements.SETTINGS },
      ];
    })
  );

  shipmentTypes: ShipmentType[] = [];
  displayedColumns: Iterable<string> = ['Name', 'Cost', 'Actions']
  allOrders: PageableOrder = {} as PageableOrder

  constructor(
    private shipmentService: ShipmentService,
    private orderManagementService: OrderManagementService,
    private dialog: MatDialog,
  ) {
  }

  getTemplate(type: string): TemplateRef<any> {
    switch (type) {
      case 'orders':
        return this.ordersTemplate;
      case 'settings':
        return this.settingsTemplate;
      case 'sales':
        return this.salesTemplate;
      default:
        return this.defaultTemplate;
    }
  }

  ngOnInit(): void {
    this.loadShipmentTypes();
    this.loadOrders();
  }

  loadShipmentTypes() {
    this.shipmentService.getShipmentTypes().subscribe({
      next: value => {
        this.shipmentTypes = value
      }
    })
  }

  loadOrders() {
    this.orderManagementService.allOrders().subscribe({
      next: value => {
        this.allOrders = value;
      }
    })
  }

  addShipmentType(): void {
    this.dialog.open(AddShipmentModalComponent, {}).afterClosed().subscribe((result) => {
      if (result) {
        this.shipmentService.addShipmentType(result).subscribe({
          next: value => {
            this.loadShipmentTypes();
          }
        })
      }
    })
  }

  editShipmentType(element: ShipmentType) {
    this.dialog.open(AddShipmentModalComponent, {data: element}).afterClosed().subscribe((result) => {
      if (result) {
        result['shipment_type_id'] = element.shipment_type_id
        this.shipmentService.editShipmentType(result).subscribe({
          next: value => {
            this.loadShipmentTypes();
          }
        })
      }
    })
  }

  deleteShipmentType(element: ShipmentType) {
    this.shipmentService.deleteShipmentType(element).subscribe({
      next: value => {
        this.loadShipmentTypes();
      }
    })
  }

  viewOrder(order: Order) {

  }

  deleteOrder(order: Order) {
    this.dialog.open(DeleteOrderDialogComponent).afterClosed().subscribe((result) => {
      if(result) {
        this.orderManagementService.deleteOrder(order).subscribe({
          next: value => {
            this.loadOrders();
          }
        })
      }
    })
  }

  updateStatus(order: Order) {
    this.dialog.open(UpdateStatusModalComponent, {data: order}).afterClosed()
      .subscribe((result) => {
        if (result) {
          this.orderManagementService.updateOrder(result).subscribe({
            next: value => {
              this.loadOrders();
            }
          })
        }
      })
  }
}
