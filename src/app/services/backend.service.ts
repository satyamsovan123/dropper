import { Injectable } from '@angular/core';
import { FileUploadForm } from '../models/FileUploadForm.model';
import { from, lastValueFrom } from 'rxjs';
import { TableData } from '../models/TableData.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../constants/constants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  backendUrl: string = environment.backendUrl + API_ENDPOINTS.BASE_API;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  uploadMetadata(data: FileUploadForm) {
    return this.httpClient.post(
      `${this.backendUrl}${API_ENDPOINTS.UPLOAD_META_DATA}`,
      data
    );
  }

  uploadFiles(data: FormData) {
    return this.httpClient.post(
      `${this.backendUrl}${API_ENDPOINTS.UPLOAD_FILES}`,
      data
    );
  }

  getFileData() {
    return this.httpClient.get(`${this.backendUrl}${API_ENDPOINTS.GET_DATA}`);
  }

  deleteData(data: TableData[]) {
    return this.httpClient.post(
      `${this.backendUrl}${API_ENDPOINTS.DELETE_DATA}`,
      data
    );
  }

  getDeletionTime() {
    return this.httpClient.get(
      `${this.backendUrl}${API_ENDPOINTS.GET_DELETION_TIME}`
    );
  }

  downloadFile(fileName: {}) {
    return this.httpClient.post(
      `${this.backendUrl}${API_ENDPOINTS.DOWNLOAD_FILE}`,
      fileName,
      { responseType: 'blob' }
    );
  }
}
