import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOfferComponent } from './user-offer.component';

describe('UserOfferComponent', () => {
  let component: UserOfferComponent;
  let fixture: ComponentFixture<UserOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
