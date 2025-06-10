import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelsComponent } from './list-models.component';

describe('ListModelsComponent', () => {
  let component: ListModelsComponent;
  let fixture: ComponentFixture<ListModelsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
