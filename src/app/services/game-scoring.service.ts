import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameScoringService {
  private totalScore = 0;

  getScore(): number {
    return this.totalScore;
  }

  resetScore(): void {
    this.totalScore = 0;
  }

  /**
   * Calcule un score basé sur la vitesse de réponse
   * @param timeLeft secondes restantes
   * @param totalTime durée totale du round
   */
  computeScore(timeLeft: number, totalTime: number): number {
    const ratio = timeLeft / totalTime;

    let score = 0;
    if (ratio >= 0.5) score = 10;
    else if (ratio >= 0.2) score = 5;
    else if (ratio > 0) score = 2;

    this.totalScore += score;
    return score;
  }
}
