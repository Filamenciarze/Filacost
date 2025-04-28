import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestContainerComponent } from './guest-container.component';

describe('GuestContainerComponent', () => {
  let component: GuestContainerComponent;
  let fixture: ComponentFixture<GuestContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
