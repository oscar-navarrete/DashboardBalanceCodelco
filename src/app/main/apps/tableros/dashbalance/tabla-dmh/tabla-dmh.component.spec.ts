import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDMHComponent } from './tabla-dmh.component';

describe('TablaDMHComponent', () => {
  let component: TablaDMHComponent;
  let fixture: ComponentFixture<TablaDMHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDMHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDMHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
