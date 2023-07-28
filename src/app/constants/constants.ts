export const BACKEND_URL = 'http://localhost:3000';

export const SERVER_ERROR = {
  unkownError: 'Unknown Error',
};

export const USER_ACTION_MESSAGES = {
  dataUploadSuccess: 'Data uploaded successfully.',
  metadataUploadSuccess: 'Metadata uploaded successfully.',
  fileUploadSuccess: 'File uploaded successfully.',
  noFilesFound: 'No files found. Please upload some files.',
  noFilesFoundToDownload: 'No file found. Please upload file.',
  dataDownloadError: 'Unable to download file.',

  dataUploadError: 'Unable to upload data.',
  getDataSuccess: 'Received data successfully.',
  getDataError: 'Unable to get data.',
  deleteDataSuccess: 'Data deleted successfully.',
  deleteDataError: 'Unable to delete data.',
  noDataToDelete: 'Please filter the table data to delete files form server.',
};

export const FILE_UPLOAD_FORM_ERROR_MESSAGE = {
  name: 'Name is a required field.',
  passphrase: 'Passphrase is invalid.',
  files: 'Files is a required field.',
};

export const FILE_UPLOAD_FORM_ERROR_FEEDBACK = {
  name: 'Please enter your name.',
  passphrase: 'Please enter a valid passphrase.',
  files: 'Please select at least one file.',
};

export const API_ENDPOINTS = {
  BASE_API: '/api',
  UPLOAD_META_DATA: '/upload-metadata',
  UPLOAD_FILES: '/upload-files',
  GET_DATA: '/get-data',
  DELETE_DATA: '/delete-data',
  GET_DELETION_TIME: '/auto-delete',
  DOWNLOAD_FILE: '/download-file',
};
