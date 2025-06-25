import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAddDialogComponent } from './profile-add-dialog.component';

describe('ProfileAddDialogComponent', () => {
  let component: ProfileAddDialogComponent;
  let fixture: ComponentFixture<ProfileAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
