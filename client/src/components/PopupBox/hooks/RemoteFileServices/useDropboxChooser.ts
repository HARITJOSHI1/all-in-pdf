import React, { useEffect, useState } from 'react';

interface ConfigChooser {
  multiselect?: boolean | undefined;
  linkType?: 'preview' | 'direct' | undefined;
  extensions?: string[] | undefined;
  folderselect?: boolean | undefined;
  sizeLimit?: number | undefined;
}

interface ChooserCallBacks {
  successCb: (files: ReadonlyArray<Dropbox.ChooserFile>) => void;
  cancelCb?: <T>(...args: Array<T>) => void;
}

export function useDropboxChooser(appKey: string) {
  const [isInit, setInit] = useState(false);
  useEffect(() => {
    if (isInit) return;

    function initDropboxApi() {
      setInit(true);
    }

    const sc = document.createElement('script');
    sc.src = 'https://www.dropbox.com/static/api/2/dropins.js';
    sc.dataset.appKey = appKey;
    sc.onload = initDropboxApi;
    sc.id = 'dropboxjs';
    document.body.appendChild(sc);

    return () => {
      document.body.removeChild(sc);
    };
  }, []);

  const createDropboxChooser = (
    callbacks: ChooserCallBacks,
    config: ConfigChooser
  ) => {
    window.Dropbox?.choose({
      success: callbacks.successCb,
      cancel: callbacks.cancelCb,
      linkType: config.linkType,
      multiselect: config.multiselect,
      extensions: config.extensions,
      folderselect: config.folderselect,
      sizeLimit: config.sizeLimit,
    });
  };

  return { createDropboxChooser };
}
