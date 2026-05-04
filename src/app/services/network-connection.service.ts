import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionService {
  public connected$ = new BehaviorSubject(window.navigator.onLine);

  constructor() {
    this.init();
  }

  private init(): void {
    window.addEventListener('online', ev => this.connected$.next(true));
    window.addEventListener('offline', ev => this.connected$.next(false));
  }
}
