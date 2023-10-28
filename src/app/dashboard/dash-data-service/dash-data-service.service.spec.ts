import { TestBed } from '@angular/core/testing';

import { DashDataServiceService } from './dash-data-service.service';

describe('DashDataServiceService', () => {
  let service: DashDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
