import React, { useEffect } from 'react';
import { RemoteFileRenderArgs } from './PDFBtn';

const RemoteFileUploader = (...args: RemoteFileRenderArgs[]) => {
  if (args[0].remote === 'DRIVE') return 'DRIVE';
  return 'DROPBOX';
};

export default RemoteFileUploader;
