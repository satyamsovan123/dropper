import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableData } from 'src/app/models/TableData.model';
import { BackendService } from 'src/app/services/backend.service';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-view-files',
  templateUrl: './view-files.component.html',
  styleUrls: ['./view-files.component.css'],
})
export class ViewFilesComponent implements OnInit, AfterViewChecked {
  constructor(
    private backendService: BackendService,
    private commonService: CommonService
  ) {}

  ngAfterViewChecked(): void {
    if (!this.viewInitialized) {
      this.viewInitialized = true;
      this.getFileData();
    }
  }

  data!: TableData[];
  viewInitialized: boolean = false;

  ngOnInit() {}

  getFileData() {
    this.commonService.updateSpinnerSubject(true);
    let message: string = '';

    this.backendService
      .getFileData()
      .pipe(
        finalize(() => {
          this.commonService.notificationMessageSubject.next(message);
          this.commonService.updateNotificationSubject(true);
          this.commonService.updateSpinnerSubject(false);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          console.log(response);
          message = response.message;
        },
        error: (error: any) => {
          console.log(error);
          message = error.message;
        },
      });
  }
}
