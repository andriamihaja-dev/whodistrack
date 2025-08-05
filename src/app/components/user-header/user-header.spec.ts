import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHeaderComponent } from './user-header';
import { SpotifyUser } from '../../models/spotify.models';
import { By } from '@angular/platform-browser';

describe('UserHeaderComponent', () => {
  let component: UserHeaderComponent;
  let fixture: ComponentFixture<UserHeaderComponent>;

  const mockUser: SpotifyUser = {
    id: 'user123',
    display_name: 'Test User',
    email: 'test@example.com',
    images: [{ url: 'https://example.com/avatar.jpg' }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHeaderComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user display name', () => {
    const username = fixture.nativeElement.querySelector('.username');
    expect(username.textContent).toContain(mockUser.display_name);
  });

  it('should emit logout event when button is clicked', () => {
    spyOn(component.logout, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.logout.emit).toHaveBeenCalled();
  });
});
