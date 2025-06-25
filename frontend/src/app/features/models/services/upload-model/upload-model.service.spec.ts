import { TestBed } from '@angular/core/testing';

import { UploadModelService } from './upload-model.service';

describe('UploadModelService', () => {
  let service: UploadModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
