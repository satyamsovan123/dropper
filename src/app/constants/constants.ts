export const BACKEND_URL = 'http://localhost:3000';
export const FILE_UPLOAD_SUCCESS_MESSAGE = 'Data uploaded successfully.';
export const FILE_UPLOAD_ERROR_MESSAGE = 'Unable to upload data.';
export const UNABLE_TO_GET_DATA = 'Unable to get data.';

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
  UPLOAD_DATA: '/upload-data',
  GET_DATA: '/get-data',
};
