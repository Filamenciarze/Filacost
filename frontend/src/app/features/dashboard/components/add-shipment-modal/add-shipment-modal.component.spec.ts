import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShipmentModalComponent } from './add-shipment-modal.component';

describe('AddShipmentModalComponent', () => {
  let component: AddShipmentModalComponent;
  let fixture: ComponentFixture<AddShipmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShipmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
