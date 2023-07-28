import { Component } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileUploadForm } from '../../models/FileUploadForm.model';
import { ThemeService } from 'src/app/services/theme.service';
import { CommonService } from 'src/app/services/common.service';
import { BackendService } from 'src/app/services/backend.service';
import { Observable, concat, finalize, from } from 'rxjs';
import {
  FILE_UPLOAD_FORM_ERROR_FEEDBACK,
  USER_ACTION_MESSAGES,
  SERVER_ERROR,
} from 'src/app/constants/constants';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
})
export class UploadFilesComponent {
  fileUploadForm: FormGroup = this.generateFileUploadForm();
  files!: File[];
  fileIdentifiers!: string[];
  deletionTime: number = 0;

  errorFeedback = {
    name: FILE_UPLOAD_FORM_ERROR_FEEDBACK.name,
    passphrase: FILE_UPLOAD_FORM_ERROR_FEEDBACK.passphrase,
    files: FILE_UPLOAD_FORM_ERROR_FEEDBACK.files,
  };

  constructor(
    private formBuilder: FormBuilder,
    private deviceDetectorService: DeviceDetectorService,
    public themeService: ThemeService,
    private commonService: CommonService,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.commonService.updateSpinnerSubject(true);

    let message: string = '';

    this.backendService
      .getDeletionTime()
      .pipe(
        finalize(() => {
          this.commonService.updateSpinnerSubject(false);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.deletionTime = response.data;
          message = response.message
            ? response.message
            : USER_ACTION_MESSAGES.dataUploadSuccess;
        },
        error: (error: any) => {
          message = error.message
            ? error.message
            : USER_ACTION_MESSAGES.dataUploadError;
        },
      });
  }

  onFileChange(event: any) {
    this.files = Array.from(event.target.files);
    if (this.files.length === 0) {
      return;
    }
  }

  checkErrorsInForm(form: FormGroup): string {
    let errorMessage: string = '';

    Object.keys(form.controls).forEach((key) => {
      if (key === 'name' || key === 'passphrase') {
        const controlErrors: any = form.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            errorMessage += `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } is a ${keyError} field.\n`;
          });
        }
      }
    });

    if (
      this.fileUploadForm.get('passphrase')?.value != '' &&
      this.fileUploadForm.get('passphrase')?.value.length <= 4
    ) {
      this.fileUploadForm.get('passphrase')?.setErrors({ incorrect: true });
      errorMessage = FILE_UPLOAD_FORM_ERROR_FEEDBACK.passphrase;
    } else {
      this.fileUploadForm.get('passphrase')?.setErrors(null);
    }

    return errorMessage;
  }

  handleSubmit() {
    this.commonService.updateSpinnerSubject(true);
    const errorMessage: string = this.checkErrorsInForm(this.fileUploadForm);
    if (errorMessage) {
      this.commonService.notificationMessageSubject.next(errorMessage);
      this.commonService.updateNotificationSubject(true);
      this.commonService.updateSpinnerSubject(false);
      return;
    }

    if ((this.files && this.files.length === 0) || !this.files) {
      let message = FILE_UPLOAD_FORM_ERROR_FEEDBACK.files;
      this.commonService.notificationMessageSubject.next(message);
      this.commonService.updateNotificationSubject(true);
      this.commonService.updateSpinnerSubject(false);
      return;
    }

    let message: string = '';

    const fileUploadFormData: FileUploadForm = {
      name: this.fileUploadForm.value.name,
      deviceIdentity: this.deviceInformation,
      timeStamp: Date.now(),
      passphrase: this.fileUploadForm.value.passphrase,
      autoDelete: this.fileUploadForm.value.autoDelete,
      files: this.files,
    };

    const currentFiles: FormData = new FormData();
    this.files.forEach((file: File) => {
      currentFiles.append('files', file);
    });

    const combinedBackendService$ = concat(
      this.backendService.uploadFiles(currentFiles),
      this.backendService.uploadMetadata(fileUploadFormData)
    );

    combinedBackendService$
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
          console.log(response.message);
          message = response.message
            ? response.message
            : USER_ACTION_MESSAGES.metadataUploadSuccess;
        },
        error: (error: any) => {
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = USER_ACTION_MESSAGES.dataUploadError;
          }
        },
      });
  }

  generateFileUploadForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      deviceIdentity: ['', Validators.required],
      passphrase: [''],
      timeStamp: ['', Validators.required],
      files: [[''], Validators.required],
      autoDelete: [true],
    });
  }

  get deviceInformation(): string {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    const formattedDeviceInfo: string = `${deviceInfo.browser} - ${deviceInfo.device} - ${deviceInfo.deviceType} - ${deviceInfo.os_version}`;
    return formattedDeviceInfo;
  }

  deleteUploadedFiles() {}
}
