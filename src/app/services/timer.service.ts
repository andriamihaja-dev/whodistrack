import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private timer$ = new BehaviorSubject<number>(0);
  private subscription?: Subscription;
  private remainingTime = 0;

  startTimer(duration: number, onComplete: () => void) {
    this.remainingTime = duration;
    this.timer$.next(this.remainingTime);

    this.subscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.timer$.next(this.remainingTime);
      } else {
        this.stopTimer();
        onComplete();
      }
    });
  }

  pauseTimer() {
    this.subscription?.unsubscribe();
  }

  resumeTimer(onComplete: () => void) {
    this.startTimer(this.remainingTime, onComplete);
  }

  stopTimer() {
    this.subscription?.unsubscribe();
    this.remainingTime = 0;
    this.timer$.next(0);
  }

  get timerObservable() {
    return this.timer$.asObservable();
  }
}
