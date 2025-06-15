import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAddDialogComponent } from './address-add-dialog.component';

describe('AddressAddDialogComponent', () => {
  let component: AddressAddDialogComponent;
  let fixture: ComponentFixture<AddressAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
