import { Icon, Typography } from '@mui/material';
import React from 'react';
import { Triangle } from 'react-loader-spinner';

interface Props {
  percentUploaded?: number;
}

export default function UploadLoader(props: Props) {
  return (
    <>
      <Icon sx={{ width: '8rem', height: '8rem' }}>
        <Triangle width="100%" height="100%" color="white" />
      </Icon>

      <Typography component="span" sx={{ color: 'white' }}>
        Just wait patiently!!
      </Typography>
    </>
  );
}
