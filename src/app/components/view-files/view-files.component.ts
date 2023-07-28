import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { concat, finalize } from 'rxjs';
import { TableData } from 'src/app/models/TableData.model';
import { BackendService } from 'src/app/services/backend.service';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';
import { USER_ACTION_MESSAGES } from '../../constants/constants';

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

  showModal: boolean = false;

  noDataToDelete: string = USER_ACTION_MESSAGES.noDataToDelete;
  noDataFound: string = USER_ACTION_MESSAGES.noFilesFound;

  ngAfterViewChecked(): void {
    if (!this.viewInitialized) {
      this.viewInitialized = true;
      this.getFileData();
    }
  }

  data!: TableData[];
  backupData!: TableData[];

  selectedData: any[] = [];

  noDataFromServer: boolean = false;
  viewInitialized: boolean = false;
  filterText: string = '';

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
          this.commonService.log(response);

          if (!response.data || response.data.length === 0) {
            this.noDataFromServer = true;
            message = USER_ACTION_MESSAGES.noFilesFound;
            this.commonService.notificationMessageSubject.next(message);
            this.commonService.updateNotificationSubject(true);
            this.commonService.updateSpinnerSubject(false);
            return;
          }

          this.data = response.data;
          this.backupData = response.data;

          message = response.message
            ? response.message
            : USER_ACTION_MESSAGES.getDataSuccess;
        },
        error: (error: any) => {
          this.commonService.log(error);
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = USER_ACTION_MESSAGES.dataUploadError;
          }
        },
      });
  }

  filterTableData() {
    this.selectedData = [];
    if (this.filterText.length > 0) {
      this.data = this.data.filter((row: TableData) => {
        return (
          row.name
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.timeStamp
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.size
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.author.toLocaleLowerCase().includes(this.filterText.toLowerCase())
        );
      });
      this.selectedData = this.data;
    } else {
      this.data = this.backupData;
    }
  }

  showDeleteModal() {
    if (this.selectedData.length !== 0) {
      this.showModal = true;
    }
  }

  deleteData() {
    this.commonService.updateSpinnerSubject(true);
    let message: string = '';

    this.backendService
      .deleteData(this.selectedData)
      .pipe(
        finalize(() => {
          this.commonService.notificationMessageSubject.next(message);
          this.commonService.updateNotificationSubject(true);
          this.commonService.updateSpinnerSubject(false);
          this.showModal = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          this.backupData = response.data;
          this.commonService.log(response);
          message = response.message
            ? response.message
            : USER_ACTION_MESSAGES.deleteDataSuccess;
        },
        error: (error: any) => {
          this.commonService.log(error);
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = USER_ACTION_MESSAGES.dataUploadError;
          }
        },
      });
  }

  downloadFile(fileName: string) {
    this.commonService.updateSpinnerSubject(true);
    let message: string = '';

    if (!fileName) {
      this.commonService.notificationMessageSubject.next(
        USER_ACTION_MESSAGES.noFilesFoundToDownload
      );
      this.commonService.updateNotificationSubject(true);
      this.commonService.updateSpinnerSubject(false);
      return;
    }

    let requestBody = {
      fileName: fileName,
    };
    this.backendService
      .downloadFile(requestBody)
      .pipe(
        finalize(() => {
          this.commonService.notificationMessageSubject.next(message);
          this.commonService.updateNotificationSubject(true);
          this.commonService.updateSpinnerSubject(false);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.commonService.log(response);

          const url = URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);

          message = response.message
            ? response.message
            : USER_ACTION_MESSAGES.getDataSuccess;
        },
        error: (error: any) => {
          this.commonService.log(error);
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = USER_ACTION_MESSAGES.dataDownloadError;
          }
        },
      });
  }
}
