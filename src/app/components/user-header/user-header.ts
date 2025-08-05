import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyUser } from '../../models/spotify.models';

@Component({
  standalone: true,
  selector: 'app-user-header',
  templateUrl: './user-header.html',
  styleUrls: ['./user-header.css'],
  imports: [CommonModule]
})
export class UserHeaderComponent {
  @Input() user!: SpotifyUser;
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
