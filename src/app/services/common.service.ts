import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router) {}

  spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerSubject$ = this.spinnerSubject.asObservable();

  notificationSubject = new BehaviorSubject<boolean>(false);
  notificationSubject$ = this.notificationSubject.asObservable();

  notificationMessageSubject = new BehaviorSubject<string>('');
  notificationMessageSubject$ = this.notificationMessageSubject.asObservable();

  updateSpinnerSubject(spinnerState: boolean) {
    this.spinnerSubject.next(spinnerState);
  }

  updateNotificationSubject(notificationState: boolean) {
    this.notificationSubject.next(notificationState);
  }

  updateNotificationMessageSubject(message: string) {
    this.notificationMessageSubject.next(message);
  }

  clearNotificationOnRouteChange() {
    this.router.events.subscribe((event) => {
      this.updateNotificationSubject(false);
      this.updateNotificationMessageSubject('');
    });
  }
}
