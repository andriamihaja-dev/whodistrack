import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistCardComponent } from './playlist-card';
import { SpotifyPlaylist } from '../../models/spotify.models';
import { By } from '@angular/platform-browser';

describe('PlaylistCardComponent', () => {
  let component: PlaylistCardComponent;
  let fixture: ComponentFixture<PlaylistCardComponent>;

  const mockPlaylist: SpotifyPlaylist = {
    id: '123',
    name: 'Test Playlist',
    images: [{ url: 'https://example.com/cover.jpg' }],
    tracks: { total: 15 },
    description: 'A cool test playlist'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistCardComponent);
    component = fixture.componentInstance;
    component.playlist = mockPlaylist;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display playlist name', () => {
    const nameEl = fixture.nativeElement.querySelector('strong');
    expect(nameEl.textContent).toContain(mockPlaylist.name);
  });

  it('should display playlist description', () => {
    const descEl = fixture.nativeElement.querySelector('p');
    expect(descEl.textContent).toContain(mockPlaylist.description);
  });


});
