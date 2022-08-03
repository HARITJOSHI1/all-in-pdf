import { Box, Grid, Icon, Stack, Typography } from '@mui/material';
import React from 'react';
import { GMQ } from '../../../reducers';
import { GrDocumentZip } from 'react-icons/gr';
import { AxiosResponse } from 'axios';

interface Props {
  breakpoint: GMQ;
  response: AxiosResponse;
}

export default function Document(props: Props) {
  const { data } = props.response;
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  // console.log('Here is ur data', data);

  const path = window.location.pathname.split('/').pop() as string;
  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      lg={4}
      sx={[
        {
          width: '100%',
          border: '1px solid white',
          borderRadius: '5px',
          py: '2rem',
        },
        (mobile || tabPort) && { width: '100%', mb: '4rem' },
      ]}
    >
      <Stack
        direction="column"
        justifyContent="center"
        spacing={1}
        alignItems="center"
        sx={{ width: '100%', height: '100%' }}
      >
        <Icon sx={{ width: '4rem', height: '4rem' }}>
          <GrDocumentZip
            style={{ width: '100%', height: '100%' }}
            color="white"
          />
        </Icon>

        <Stack direction="column" alignItems="center">
          <Typography
            component="span"
            sx={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '100',
              width: '100%',
            }}
          >
            {(data.data as string).slice(0, 15)}...
          </Typography>
          
          {/* 
          <Typography
            component="span"
            sx={{ color: "white", fontSize: "1.5rem", fontWeight: "200" }}
          >
            22kb
          </Typography> */}

        </Stack>
      </Stack>
    </Grid>
  );
}
