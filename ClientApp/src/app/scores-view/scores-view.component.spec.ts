import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresViewComponent } from './scores-view.component';

describe('ScoresViewComponent', () => {
  let component: ScoresViewComponent;
  let fixture: ComponentFixture<ScoresViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoresViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
