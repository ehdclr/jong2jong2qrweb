import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrloginComponent } from './qrlogin.component';

describe('QrloginComponent', () => {
  let component: QrloginComponent;
  let fixture: ComponentFixture<QrloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
