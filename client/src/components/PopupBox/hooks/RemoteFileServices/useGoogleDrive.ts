import axios, { AxiosResponse } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { String } from 'ts-toolbelt';
import _ from 'lodash';
import { FileContextStore } from '../../../PDFOps/Operation';

type scopeDef<T extends string> = String.Split<T, ','>;
type spaceSepStr = String.Join<scopeDef<string>, ' '>;
type GetEnumKeys<TEnum> = keyof TEnum;

export interface PickerConfig {
  apiKey: string;
  appId: string;
  features: {
    [key in GetEnumKeys<typeof google.picker.Feature>]?: boolean;
  };
  navHidden?: boolean;
  exportAsBlobs?: boolean;
  viewType: {
    [key in GetEnumKeys<typeof google.picker.ViewId>]?: boolean;
  };
}

export type PickerCb = (data: google.picker.ResponseObject) => void;
export type PickerFunc = (config: PickerConfig, cb: PickerCb) => void;
export type PdownloadFilesAsBlobs = (
  docs: google.picker.DocumentObject[]
) => Promise<PromiseSettledResult<AxiosResponse<any, any>>[] | undefined>;
type GOauth2Token = string | null;

function chainFeatures(
  Builder: google.picker.PickerBuilder,
  features: GetEnumKeys<typeof google.picker.Feature>[],
  i: number
): google.picker.PickerBuilder {
  if (i === features.length) return Builder;

  Builder.enableFeature(window.google.picker.Feature[features[i]]);
  const Obj = chainFeatures(Builder, features, i + 1);
  return Obj;
}

export function useGoogleDrive(SCOPES: spaceSepStr, clientId: string) {
  const [gisInit, setGisInit] = useState(false);
  const [pickerInit, setPickerInit] = useState(false);
  const [accessToken, setAccessToken] = useState<GOauth2Token>(null);
  const [exportAsBlobs, setExportAsBlobs] = useState(true);
  const [client, setClient] =
    useState<google.accounts.oauth2.TokenClient | null>(null);
  const { setRemoteFileLoad } = useContext(FileContextStore)[1];

  useEffect(() => {
    const arr = loadApis(
      'https://accounts.google.com/gsi/client',
      'https://apis.google.com/js/api.js'
    )!;

    return () => {
      arr.forEach((s) => {
        document.body.removeChild(s);
      });
    };
  }, []);

  const createPicker: PickerFunc = (config, cb) => {
    if (!config.exportAsBlobs) setExportAsBlobs(false);

    let viewOpt: GetEnumKeys<typeof google.picker.ViewId> | null = null;
    _.forOwn(config.viewType, function (value, key) {
      if (value!) viewOpt = key as GetEnumKeys<typeof google.picker.ViewId>;
    });

    let features: GetEnumKeys<typeof google.picker.Feature>[] = [];
    _.forOwn(config.features, function (value, key) {
      if (value!)
        features.push(key as GetEnumKeys<typeof google.picker.Feature>);
    });

    const view = new window.google.picker.DocsView(
      window.google.picker.ViewId[viewOpt!]
    );

    const Builder = chainFeatures(
      new window.google.picker.PickerBuilder(),
      features,
      1
    );

    const picker = Builder.setDeveloperKey(
      'AIzaSyDnUoAlPrQEQCbKawAudmkvVrFdGfXfUEc'
    )
      .setAppId('superpdf-258ed')
      .setOAuthToken(accessToken as string)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(cb)
      .build();
    picker.setVisible(true);
  };

  const downloadFilesAsBlobs: PdownloadFilesAsBlobs = async (
    docs: google.picker.DocumentObject[]
  ) => {
    if (exportAsBlobs) {
      let blobArr: Promise<AxiosResponse<any, any>>[] | null = null;
      setRemoteFileLoad(true);
      blobArr = docs.map((d) =>
        axios.get(
          `https://www.googleapis.com/drive/v3/files/${d.id}?alt=media`,
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${accessToken as string}`,
            },
          }
        )
      );

      return await Promise.allSettled(blobArr);
    }
  };

  const loadApis = (...args: string[]) => {
    if (gisInit) return;
    const initializePicker = () => {
      if (pickerInit) return;
      window.gapi.load('picker', () => setPickerInit(true));
    };

    const initializeGsi = () => {
      if (gisInit) return;
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (tokenResponse) => setAccessToken(tokenResponse.access_token),
      });

      setGisInit(true);
      setClient(client);
    };

    const script = document.createElement('script');
    const script2 = document.createElement('script');

    script.src = args[0];
    script2.src = args[1];

    script.onload = initializeGsi;
    script2.onload = initializePicker;

    script.defer = true;
    script.async = true;

    script2.defer = true;
    script2.async = true;

    const sc1 = document.querySelector('body')?.appendChild(script)!;
    const sc2 = document.querySelector('body')?.appendChild(script2)!;
    return [sc1, sc2];
  };

  return [createPicker, accessToken, downloadFilesAsBlobs, client!] as const;
}
