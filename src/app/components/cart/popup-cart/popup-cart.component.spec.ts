import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCartComponent } from './popup-cart.component';

describe('PopupCartComponent', () => {
  let component: PopupCartComponent;
  let fixture: ComponentFixture<PopupCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
