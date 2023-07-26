export interface FileUploadForm {
  name: string;
  deviceIdentity: string;
  timeStamp: number;
  passphrase: string;
  files: File[];
}
