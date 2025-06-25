import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCartDialogComponent } from './add-cart-dialog.component';

describe('AddCartDialogComponent', () => {
  let component: AddCartDialogComponent;
  let fixture: ComponentFixture<AddCartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCartDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
