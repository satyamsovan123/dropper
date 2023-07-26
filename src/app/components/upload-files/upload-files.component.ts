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
import { finalize } from 'rxjs';
import { FILE_UPLOAD_FORM_ERROR_FEEDBACK } from 'src/app/constants/constants';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
})
export class UploadFilesComponent {
  fileUploadForm: FormGroup = this.generateFileUploadForm();
  files!: File[];

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

  ngOnInit() {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const files: File[] = event.target.files;
      this.files = files;
    }
  }

  checkErrorsInForm(form: FormGroup): string {
    let errorMessage: string = '';
    Object.keys(form.controls).forEach((key) => {
      if (key === 'name' || key === 'passphrase' || key === 'files') {
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
    return errorMessage;
  }

  handleSubmit() {
    this.commonService.updateSpinnerSubject(true);
    const errorMessage: string = this.checkErrorsInForm(this.fileUploadForm);
    if (errorMessage) {
      // console.log(errorMessage);

      this.commonService.notificationMessageSubject.next(errorMessage);
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
      files: this.files,
    };

    this.backendService
      .uploadData(fileUploadFormData)
      .pipe(
        finalize(() => {
          this.commonService.notificationMessageSubject.next(message);
          this.commonService.updateNotificationSubject(true);
          this.commonService.updateSpinnerSubject(false);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          message = response.message;
        },
        error: (error: any) => {
          console.log(error);
          message = error.message;
        },
      });
  }

  generateFileUploadForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      deviceIdentity: ['', Validators.required],
      passphrase: [''],
      timeStamp: ['', Validators.required],
      files: [null, Validators.required],
    });
  }

  get deviceInformation(): string {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    const formattedDeviceInfo: string = `${deviceInfo.browser} - ${deviceInfo.device} - ${deviceInfo.deviceType} - ${deviceInfo.os_version}`;
    return formattedDeviceInfo;
  }
}
