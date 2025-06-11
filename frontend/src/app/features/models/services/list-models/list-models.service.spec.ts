import { TestBed } from '@angular/core/testing';

import { ListModelsService } from './list-models.service';

describe('ListModelsService', () => {
  let service: ListModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
