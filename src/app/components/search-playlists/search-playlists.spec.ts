import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchPlaylistsComponent } from './search-playlists';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { SpotifyPlaylist } from '../../models/spotify.models';
import { FormsModule } from '@angular/forms';

describe('SearchPlaylistsComponent', () => {
  let component: SearchPlaylistsComponent;
  let fixture: ComponentFixture<SearchPlaylistsComponent>;
  let httpMock: HttpTestingController;

  const mockSpotifyAuthService = {
    getAccessToken: () => 'mock_token'
  };

  const mockResponse = {
    playlists: {
      items: [
        {
          id: '1',
          name: 'Mock Playlist',
          images: [{ url: 'https://example.com/image.jpg' }],
          tracks: { total: 10 },
          description: 'Test description'
        }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPlaylistsComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: SpotifyAuthService, useValue: mockSpotifyAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPlaylistsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch playlists when searchQuery is typed', fakeAsync(() => {
    component.searchQuery = 'anime';
    component.onSearchChange();

    tick(300); // debounceTime

    const req = httpMock.expectOne(req =>
      req.url.includes('https://api.spotify.com/v1/search') &&
      req.params.get('q') === 'anime'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    component.results$.subscribe(results => {
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Mock Playlist');
    });
  }));

  
});
