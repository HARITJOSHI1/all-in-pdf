import { Button, Box, Typography, Icon, SxProps } from '@mui/material';
import React from 'react';
import { AiOutlineFileAdd } from 'react-icons/ai';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { connect } from 'react-redux';
import { GMQ, State } from '../../reducers';
import { IconType } from 'react-icons/lib';
import { AxiosResponse } from 'axios';

interface Props {
  isConn: boolean;
  IconForBtn: IconType;
  fn?: (
    e?: React.MouseEvent,
    numFiles?: number
  ) => Promise<AxiosResponse | void> | void;
  numFiles?: number;
  text?: string;
  breakpoint: GMQ;
  sx: SxProps;
}

function UploadBtn(props: Props) {
  const { fn, numFiles, isConn, sx, IconForBtn } = props;
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  return (
    <Button
      variant="contained"
      disableRipple
      size="medium"
      onClick={async (e) => {
        await fn!(e, numFiles as number);
      }}
      sx={[
        {
          px: '0 !important',
          pt: '0',
          pb: '0',
          display: 'flex',
          background: 'white',
          alignItems: 'flex-start',
          overflow: 'hidden',
          '&:hover': {
            background: 'white',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          height: '4rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            transition: 'all .2s',
            background: '#d4d3d2',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            color: 'black',
          }}
        >
          <Icon sx={{ width: '1.5rem', height: '2rem', mr: '.5rem' }}>
            <IconForBtn style={{ width: '100%', height: '100%' }} />
          </Icon>

            <span style={{ fontWeight: '900' }}>
              {`${props.text} ${numFiles? `(${numFiles})` : ""}`}
            </span>
        </Typography>
      </Box>

      {isConn && (
        <Button
          size="small"
          onClick={(event) => event.stopPropagation()}
          sx={{
            p: '1rem',
            alignSelf: 'stretch',
            borderLeft: '1px solid #d4d3d2',
            borderRadius: '0',

            '&:hover': {
              transition: 'all .2s',
              background: '#d4d3d2',
            },
          }}
        >
          <Icon sx={{ width: '100%', height: '2rem' }}>
            <KeyboardArrowDownIcon style={{ width: '100%', height: '100%' }} />
          </Icon>
        </Button>
      )}
    </Button>
  );
}

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
  };
};

export default connect(mapStateToProps)(UploadBtn);
