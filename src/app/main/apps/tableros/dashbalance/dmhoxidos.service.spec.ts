import { TestBed } from '@angular/core/testing';

import { DmhoxidosService } from './dmhoxidos.service';

describe('DmhoxidosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DmhoxidosService = TestBed.get(DmhoxidosService);
    expect(service).toBeTruthy();
  });
});
