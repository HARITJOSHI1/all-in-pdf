import {
  Card,
  CardContent,
  Icon,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { IconType } from 'react-icons';
import { RemoteFileRenderArgs } from '../PDFOps/Dropzone/PDFBtn';
import { GMQ } from '../reducers';
import axios, { AxiosResponse } from 'axios';
import { gapi } from 'gapi-script';

export interface PopupBoxList<T> {
  type?: string;
  avatar?: IconType;
  text: string;
  cb?: (...args: T[]) => 'DRIVE' | 'DROPBOX';
}

interface Props {
  listArr: PopupBoxList<RemoteFileRenderArgs>[];
  breakpoint?: GMQ;
}

const PopupBoxListSection = (items: PopupBoxList<RemoteFileRenderArgs>[]) => {
  const [openPicker, authResponse] = useDrivePicker();
  const [downloadedFilesAsBlobs, setDownloadedFilesAsBlobs] = useState();
  const clientId =
    '998380890751-s9rlc317vk76otbcmg4imjisrcrngia3.apps.googleusercontent.com';
  // console.log(authResponse);
  // let auth2
  // const accessToken = gapi.auth.getToken().access_token;
  // console.log(accessToken);

  const callFn = (item: PopupBoxList<RemoteFileRenderArgs>) => {
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    let val: 'DRIVE' | 'DROPBOX';
    if (item && item.cb) {
      val = item.cb();

      switch (val) {
        case 'DRIVE':
          openPicker({
            clientId,
            developerKey: 'AIzaSyDnUoAlPrQEQCbKawAudmkvVrFdGfXfUEc',
            viewId: 'PDFS',
            token: authResponse?.access_token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
              if (data.action === 'cancel') {
                console.log('User clicked cancel/close button');
              } else if (data.action === 'picked') {
                // const res = axios.get(data);
                // let blobArr: Promise<AxiosResponse<any, any>>[] | null = null;
                // blobArr = data.docs.map((d) =>
                //   axios.get(
                //     `https://www.googleapis.com/drive/v3/files/${d.id}?alt=media`,
                //     {
                //       responseType: 'blob',
                //       headers: {
                //         Authorization: `Bearer ${accessToken}`,
                //       },
                //     }
                //   )
                // );

                // Promise.allSettled(blobArr).then((result) => {
                //   console.log(result);
                // });
              }

              console.log(data, authResponse?.access_token);
            },
          });

          break;

        case 'DROPBOX':
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
