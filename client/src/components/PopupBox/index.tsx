import {
  Card,
  CardContent,
  Icon,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { RemoteFileRenderArgs } from '../PDFOps/Dropzone/PDFBtn';
import { GMQ } from '../reducers';
import axios, { AxiosResponse } from 'axios';
import {
  PickerConfig,
  useGoogleDrive,
} from './hooks/RemoteFileServices/useGoogleDrive';
import { FileContextStore } from '../PDFOps/Operation';
import { useDropboxChooser } from './hooks/RemoteFileServices/useDropboxChooser';
// import DropboxSDK from 'dropbox';

export interface PopupBoxList<T> {
  type?: string;
  avatar?: IconType;
  text: string;
  cb?: (...args: T[]) => string | void;
}

interface Props {
  listArr: PopupBoxList<RemoteFileRenderArgs>[];
  breakpoint?: GMQ;
}

const PopupBoxListSection = (items: PopupBoxList<RemoteFileRenderArgs>[]) => {
  const clientId =
    '998380890751-s9rlc317vk76otbcmg4imjisrcrngia3.apps.googleusercontent.com';
  const GOOGLE_APIKEY = 'AIzaSyDnUoAlPrQEQCbKawAudmkvVrFdGfXfUEc';
  const DROPBOX_ACCESS_TOKEN = '9c42jlzwz6cso91';

  const appId = 'superpdf-258ed';

  const [createPicker, accessToken, downloadFilesAsBlobs, client] =
    useGoogleDrive('https://www.googleapis.com/auth/drive', clientId);

  const { createDropboxChooser } = useDropboxChooser('fxwvf1dsihb4e8l');

  const { setFiles } = useContext(FileContextStore)[0];
  const { setRemoteFileLoad } = useContext(FileContextStore)[1];
  const { setPercentUploaded } = useContext(FileContextStore)[2];
  
  const config: PickerConfig = {
    apiKey: GOOGLE_APIKEY,
    appId,
    features: {
      MULTISELECT_ENABLED: true,
      NAV_HIDDEN: true,
    },

    viewType: {
      PDFS: true,
    },
    exportAsBlobs: true,
  };

  function pickerCallback(data: google.picker.ResponseObject) {
    if (data.action === google.picker.Action.PICKED) {
      const docs = data[google.picker.Response.DOCUMENTS];

      downloadFilesAsBlobs(docs).then((res) => {
        const blobArr = res?.map((r, idx) => {
          switch (r.status) {
            case 'fulfilled':
              setRemoteFileLoad(false);
              r.value.data.name = docs[idx].name;
              return r.value.data as File;
            default:
              setRemoteFileLoad(false);
              return null;
          }
        })!;

        setFiles(blobArr);
        setPercentUploaded(0);
      });
    }
  }

  useEffect(() => {
    if (accessToken) createPicker(config, pickerCallback);
  }, [accessToken]);

  const callFn = (item: PopupBoxList<RemoteFileRenderArgs>) => {
    if (item && item.cb) {
      const val = item.cb();

      switch (val) {
        case 'DRIVE':
          client.requestAccessToken();
          break;

        case 'DROPBOX':
          const successCb = async (
            files: ReadonlyArray<Dropbox.ChooserFile>
          ) => {
            // console.log("heree");

            console.log(files);
            const blobs = files.map((f) => {
              return axios.get(
                f.link,
                {
                  responseType: 'blob',
                  headers: {
                    Authorization: `Bearer 9c42jlzwz6cso91`,
                  },
                }
              );
            });

            // TODO
          };

          createDropboxChooser(
            { successCb },
            {
              multiselect: true,
              folderselect: true,
              extensions: ['.pdf'],
            }
          );
          break;
      }
    }
  };

  return items.map((i, idx) => {
    return (
      <List
        key={idx}
        sx={{
          p: 0,
          '&:not(:last-child)': {
            borderBottom: '1px solid #d4d3d2',
          },
        }}
      >
        <ListItem
          sx={{
            textDecoration: 'none',
            transition: 'all .2s',
            p: '1rem',

            '&:hover': {
              backgroundColor: '#d4d6d5',
            },
          }}
          onClick={callFn.bind(null, i)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Icon
              sx={{
                width: '2rem',
                height: '2rem',
                mr: '.5rem',
              }}
            >
              {i.avatar && <i.avatar width="100%" height="100%" />}
            </Icon>
            <ListItemText primary={i.text} />
          </Stack>
        </ListItem>
      </List>
    );
  });
};

const PopupBox: React.FC<Props> = (props) => {
  return (
    <Card sx={{ p: 0 }}>
      <CardContent sx={{ p: 0, pb: '0 !important' }}>
        {PopupBoxListSection(props.listArr)}
      </CardContent>
    </Card>
  );
};

export default PopupBox;
