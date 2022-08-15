import React, { useEffect } from 'react';
import { RemoteFileRenderArgs } from './PDFBtn';
import useDrivePicker from 'react-google-drive-picker';


const RemoteFileUploader = (...args: RemoteFileRenderArgs[]) => {
  if (args[0].remote === 'DRIVE') return 'DRIVE';
  return 'DROPBOX';
};

export default RemoteFileUploader;
