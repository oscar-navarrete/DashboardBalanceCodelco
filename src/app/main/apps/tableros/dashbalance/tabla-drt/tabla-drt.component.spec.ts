import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDRTComponent } from './tabla-drt.component';

describe('TablaDRTComponent', () => {
  let component: TablaDRTComponent;
  let fixture: ComponentFixture<TablaDRTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDRTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDRTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
