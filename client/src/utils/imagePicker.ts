import { ChangeEvent } from 'react';

const imagePicker = (e: ChangeEvent<HTMLInputElement>) => {
  const fileList: FileList[] = [];
  const fileToPreview: string[] = [];
  let error: string | null = null;
  const files = e.target.files;
  if (!files) {
    return {
      error,
      fileToPreview,
      files,
    };
  }
  if (files.length > 4) {
    return {
      error: 'Max files is 4',
      fileToPreview,
      files,
    };
  }
  // validating each file
  for (let i = 0; i < files.length; i++) {
    if (files[i].type !== 'image/jpeg') {
      error = `${files[i].type} is not supported`;
      break;
    }
    if (files[i].size > 1000000) {
      error = 'Maximum size of a file is 1MB';
      break;
    }
  }
  fileList.push(files);
  for (let i = 0; i < fileList[0].length; i++) {
    const obj = URL.createObjectURL(fileList[0][i]);
    fileToPreview.push(obj);
  }
  return {
    files,
    fileToPreview,
    error,
  };
};

export default imagePicker;
