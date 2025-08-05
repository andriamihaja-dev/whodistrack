import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockSpotifyAuthService: jasmine.SpyObj<SpotifyAuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSpotifyAuthService = jasmine.createSpyObj('SpotifyAuthService', ['getAccessToken', 'login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: SpotifyAuthService, useValue: mockSpotifyAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /dashboard if access token exists', () => {
    mockSpotifyAuthService.getAccessToken.and.returnValue('mock_token');
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect if no access token', () => {
    mockSpotifyAuthService.getAccessToken.and.returnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call SpotifyAuthService.login() on login()', () => {
    component.login();
    expect(mockSpotifyAuthService.login).toHaveBeenCalled();
  });
});
