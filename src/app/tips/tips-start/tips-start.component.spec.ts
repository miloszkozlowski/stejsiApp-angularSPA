import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsStartComponent } from './tips-start.component';

describe('TipsStartComponent', () => {
  let component: TipsStartComponent;
  let fixture: ComponentFixture<TipsStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
