import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreocorporativoComponent } from './monitoreocorporativo.component';

describe('MonitoreocorporativoComponent', () => {
  let component: MonitoreocorporativoComponent;
  let fixture: ComponentFixture<MonitoreocorporativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreocorporativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreocorporativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
