import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  constructor(private commonService: CommonService) {}
  notificationState: boolean = false;
  notificationMessage: string = '';

  ngOnInit(): void {
    this.commonService.notificationSubject$.subscribe(
      (notificationState: boolean) => {
        this.notificationState = notificationState;
        console.log(`Notification state: ${this.notificationState}`);
      }
    );

    this.commonService.notificationMessageSubject$.subscribe(
      (notificationMessage: string) => {
        this.notificationMessage = notificationMessage;
        console.log(`Notification message: ${this.notificationMessage}`);
      }
    );
  }

  clearNotification() {
    this.commonService.updateNotificationSubject(false);
    this.commonService.updateNotificationMessageSubject('');
  }
}
