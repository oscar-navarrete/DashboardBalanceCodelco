import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDGMComponent } from './tabla-dgm.component';

describe('TablaDGMComponent', () => {
  let component: TablaDGMComponent;
  let fixture: ComponentFixture<TablaDGMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDGMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDGMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
