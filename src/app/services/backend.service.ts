import { Injectable } from '@angular/core';
import { FileUploadForm } from '../models/FileUploadForm.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor() {}

  uploadData(data: FileUploadForm) {
    console.log(data);

    const promise = new Promise((resolve, reject) => {
      const sampleMessage = [
        { message: 'Data uploaded successfully.' },
        { message: 'Unable to upload data.' },
      ];
      setTimeout(() => {
        // resolve(sampleMessage[0]);
        reject(sampleMessage[1]);
      }, 1500);
    });

    return from(promise);
  }

  getFileData() {
    const promise = new Promise((resolve, reject) => {
      const sampleMessage = [
        {
          message: 'Data received successfully.',
          data: [
            {
              fileName: 'document.docx',
              fileType: 'docx',
              timestamp: '22 July 2022 11:45 AM IST',
              fileSize: '2.3 MB',
              createdBy: 'Alice-Windows-Firefox',
              uri: 'http://192.168.29.23/Desktop/files/document.docx',
            },
            {
              fileName: 'video.mp4',
              fileType: 'mp4',
              timestamp: '23 July 2022 09:10 PM IST',
              fileSize: '128.5 MB',
              createdBy: 'Bob-Android-Chrome',
              uri: 'http://192.168.29.23/Desktop/files/video.mp4',
            },
            {
              fileName: 'IMG_5678.png',
              fileType: 'png',
              timestamp: '21 July 2022 05:20 AM IST',
              fileSize: '4.0 MB',
              createdBy: 'John-iOS-Chrome',
              uri: 'http://192.168.29.23/Desktop/files/IMG_5678.png',
            },
            {
              fileName: 'photo.jpg',
              fileType: 'jpg',
              timestamp: '24 July 2022 03:30 PM IST',
              fileSize: '1.2 MB',
              createdBy: 'Emma-iOS-Safari',
              uri: 'http://192.168.29.23/Desktop/files/photo.jpg',
            },
            {
              fileName: 'spreadsheet.xlsx',
              fileType: 'xlsx',
              timestamp: '25 July 2022 08:55 AM IST',
              fileSize: '850 KB',
              createdBy: 'David-Mac-Chrome',
              uri: 'http://192.168.29.23/Desktop/files/spreadsheet.xlsx',
            },
          ],
        },
        { message: 'Unable to get data.', data: [] },
      ];
      setTimeout(() => {
        resolve(sampleMessage[0]);
        // reject(sampleMessage[1]);
      }, 4000);
    });

    return from(promise);
  }
}
