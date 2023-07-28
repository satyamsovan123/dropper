export interface FileUploadForm {
  name: string;
  deviceIdentity: string;
  timeStamp: number;
  passphrase: string;
  autoDelete: boolean;
  files: File[];
}
