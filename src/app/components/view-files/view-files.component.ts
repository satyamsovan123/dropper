import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableData } from 'src/app/models/TableData.model';
import { BackendService } from 'src/app/services/backend.service';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';
import { NO_FILES_TO_DELETE } from '../../constants/constants';

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

  noFilesToDelete: string = NO_FILES_TO_DELETE;
  ngAfterViewChecked(): void {
    if (!this.viewInitialized) {
      this.viewInitialized = true;
      this.getFileData();
    }
  }

  data!: TableData[];
  backupData!: TableData[];

  selectedData: any[] = [];

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
          this.data = response.data;
          this.backupData = response.data;
          console.log(response);
          message = response.message;
        },
        error: (error: any) => {
          console.log(error);
          message = error.message;
        },
      });
  }

  filterTableData() {
    // console.log(this.filterText);
    this.selectedData = [];
    if (this.filterText.length > 0) {
      this.data = this.data.filter((row: TableData) => {
        return (
          row.fileName
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.fileType
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.timestamp
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.fileSize
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase()) ||
          row.createdBy
            .toLocaleLowerCase()
            .includes(this.filterText.toLowerCase())
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
