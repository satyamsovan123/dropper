import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SERVER_ERROR,
  USER_ACTION_MESSAGES,
  API_ENDPOINTS,
} from '../constants/constants';

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

  log(data: any) {
    if (!environment.producton) {
      console.log(data);
    }
  }

  generateErrorMessage(currentError: HttpErrorResponse): string {
    let message: string = '';
    if (currentError.statusText === SERVER_ERROR.unkownError) {
      if (currentError.url?.includes(API_ENDPOINTS.UPLOAD_META_DATA)) {
        message = USER_ACTION_MESSAGES.dataUploadError;
      } else if (currentError.url?.includes(API_ENDPOINTS.GET_DATA)) {
        message = USER_ACTION_MESSAGES.getDataError;
      } else if (currentError.url?.includes(API_ENDPOINTS.DELETE_DATA)) {
        message = USER_ACTION_MESSAGES.deleteDataError;
      } else {
        message = currentError.message;
      }
    }
    return message;
  }
}
