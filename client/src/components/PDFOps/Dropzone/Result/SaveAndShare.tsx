import { Stack, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { GMQ } from '../../../reducers';
import PDFBtn from '../PDFBtn';
import { BsDownload } from 'react-icons/bs';
import { BsShare } from 'react-icons/bs';
import axios, { AxiosResponse } from 'axios';
import { Context } from '../../../Layout';

interface Props {
  breakpoint: GMQ;
  response: AxiosResponse;
}

export default function SaveAndShare(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const {setModal} = useContext(Context)[1];

  const downloadFile = async () => {
    const res = await axios.get('/api/v1/media/share/download', {
      params: {
        filename: props.response.data.data,
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${props.response.data.data}.zip`); 
    document.body.appendChild(link);
    link.click();

    return res;
  };

  const openShareModal = () => setModal(true);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={5}
      lg={4}
      sx={{
        border: '1px solid white',
        borderRadius: '5px',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={[
          { width: '100%', height: '100%' },
          (mobile || tabLand) && {
            flexDirection: 'column',
          },
          tabPort && { justifyContent: 'space-around' },
        ]}
      >
        <PDFBtn
          text="Download"
          fn={downloadFile}
          isConn={false}
          sx={[
            { width: '40%' },
            (mobile || tabLand) && { width: '80%' },
            tabPort && { width: '40%' },
          ]}
          IconForBtn={BsDownload}
        />

        <PDFBtn
          text="Share"
          isConn={false}
          fn = {openShareModal}
          sx={[
            { width: '40%' },
            (mobile || tabLand) && { width: '80%' },
            tabPort && { width: '40%' },
          ]}
          IconForBtn={BsShare}
        />
      </Stack>
    </Grid>
  );
}
