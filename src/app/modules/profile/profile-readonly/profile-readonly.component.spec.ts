import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReadonlyComponent } from './profile-readonly.component';

describe('ProfileReadonlyComponent', () => {
  let component: ProfileReadonlyComponent;
  let fixture: ComponentFixture<ProfileReadonlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileReadonlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
