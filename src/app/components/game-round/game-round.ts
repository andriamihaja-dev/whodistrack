import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyPlayerService } from '../../services/spotify-player.service';
import { GameService } from '../../services/game.service';
import { GameSettingsService } from '../../services/game-settings.service';
import { GameScoringService } from '../../services/game-scoring.service';
import { SpotifyTrack } from '../../models/spotify.models';

import { Subscription, timer, interval } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnswerInputComponent } from '../../components/answer-input/answer-input.component';
import { AnswerDisplayComponent } from '../../components/answer-display/answer-display.component';
import { TimerDisplayComponent } from '../../components/timer-display/timer-display.component';
import { ScoreDisplayComponent } from '../../components/score-display/score-display.component';

import { normalizeString } from '../../utils/string-utils'; 


@Component({
  selector: 'app-game-round',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    AnswerInputComponent,
    AnswerDisplayComponent,
    TimerDisplayComponent,
    ScoreDisplayComponent,
  ],
  templateUrl: './game-round.html',
  styleUrls: ['./game-round.css'],
})
export class GameRoundComponent implements OnInit, OnDestroy {
  playlistId!: string | null;
  tracks: SpotifyTrack[] = [];
  currentTrackIndex = 0;
  token: string = '';
  timerSub?: Subscription;
  countdownSub?: Subscription;
  roundTime = 30;
  timeLeft = 30;

  localScore = 0;

  loading = true;
  error = '';
  answerShown = false;
  showNextButton = false;
  wasCorrect = false;
  errorMessage: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyPlayerService: SpotifyPlayerService,
    private gameService: GameService,
    private gameSettings: GameSettingsService,
    private gameScoringService: GameScoringService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.playlistId = this.route.snapshot.paramMap.get('playlistId');
    this.roundTime = this.gameSettings.getRoundDuration();
    this.timeLeft = this.roundTime;

    if (!this.playlistId) {
      this.error = 'ID de playlist manquant.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.token = localStorage.getItem('access_token') || '';
    if (!this.token) {
      this.error = 'Token manquant ou expiré.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      await this.spotifyPlayerService.initialize(this.token);
    } catch (err) {
      this.error = "Erreur lors de l'initialisation du player Spotify.";
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.gameService
      .loadGameTracks(this.playlistId)
      .then(() => {
        this.tracks = this.gameService.getAllTracks();

        if (!this.tracks.length) {
          this.error = 'Aucune piste trouvée.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.currentTrackIndex = 0;
        this.loading = false;
        this.answerShown = false;
        this.showNextButton = false;
        this.playCurrentTrack();
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.error = 'Erreur lors du chargement des pistes.';
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  get currentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  playCurrentTrack() {
    if (!this.currentTrack?.uri) return;

    this.spotifyPlayerService.play(this.currentTrack.uri, this.token);

    this.answerShown = false;
    this.showNextButton = false;
    this.wasCorrect = false;
    this.timeLeft = this.roundTime;

    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();

    this.timerSub = timer(this.roundTime * 1000).subscribe(() => {
      this.onTimeUp();
    });

    this.countdownSub = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.detectChanges();
      }
    });

    this.cdr.detectChanges();
  }

  validateAnswer(userAnswer: string) {
  const answer = normalizeString(userAnswer);
  const normalizedTitle = normalizeString(this.currentTrack?.name || '');

  const isTitleMatch = answer === normalizedTitle;

  const isArtistMatch = (this.currentTrack?.artists || []).some(artist =>
    normalizeString(artist.name).includes(answer)
  );

  if (isTitleMatch || isArtistMatch) {
    this.wasCorrect = true;
    const gained = this.gameScoringService.computeScore(this.timeLeft, this.roundTime);
    this.localScore = this.gameScoringService.getScore();
    this.endRound();
  } else {
        this.errorMessage = '❌ Réponse incorrecte, essayez encore.';

    setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 2500);

  }
}

  getArtistsNames(): string {
  if (!this.currentTrack?.artists) return '';
  return this.currentTrack.artists.map(a => a.name).join(', ');
}

  onTimeUp() {
    this.wasCorrect = false;
    this.endRound();
  }

  endRound() {
    this.answerShown = true;
    this.showNextButton = true;
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
    this.cdr.detectChanges();
  }

  nextTrack() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.currentTrackIndex++;
      this.playCurrentTrack();
    } else {
      alert('Fin du jeu !');
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
  }

  quit() {
    this.timerSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
    this.spotifyPlayerService.player?.pause();
    this.router.navigate(['/']);
  }
}
