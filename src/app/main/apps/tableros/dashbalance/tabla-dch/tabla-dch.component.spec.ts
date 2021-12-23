import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDCHComponent } from './tabla-dch.component';

describe('TablaDCHComponent', () => {
  let component: TablaDCHComponent;
  let fixture: ComponentFixture<TablaDCHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDCHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDCHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
