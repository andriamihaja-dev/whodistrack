import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { Router } from '@angular/router';
import { SpotifyUser, SpotifyPlaylist } from '../../models/spotify.models';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  const mockSpotifyAuthService = {
    getAccessToken: () => 'mock_token',
    logout: jasmine.createSpy()
  };

  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  const mockUser: SpotifyUser = {
    id: 'user123',
    display_name: 'Test User',
    email: 'test@example.com',
    images: [{ url: 'https://example.com/avatar.jpg' }]
  };

  const mockPlaylists = {
    items: [
      {
        id: '1',
        name: 'Playlist Test',
        images: [{ url: 'https://example.com/cover.jpg' }],
        description: 'Test desc',
        tracks: { total: 10 }
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: SpotifyAuthService, useValue: mockSpotifyAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and playlists', () => {
    const reqUser = httpMock.expectOne('https://api.spotify.com/v1/me');
    reqUser.flush(mockUser);

    const reqPlaylists = httpMock.expectOne('https://api.spotify.com/v1/me/playlists');
    reqPlaylists.flush(mockPlaylists);

    component.userInfo$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    component.playlists$.subscribe(playlists => {
      expect(playlists.length).toBe(1);
      expect(playlists[0].id).toBe('1');
    });
  });

  it('should navigate to /home on logout', () => {
    component.onLogout();
    expect(mockSpotifyAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /game with playlistId', () => {
    component.playWithPlaylist('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/game'], { queryParams: { playlistId: '123' } });
  });
});
