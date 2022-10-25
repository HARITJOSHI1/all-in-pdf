import { Button, Box, Typography, Icon, SxProps, Stack } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { connect } from 'react-redux';
import { GMQ, State } from '../../reducers';
import { IconType } from 'react-icons/lib';
import { AxiosResponse } from 'axios';
import PopupBox from '../../PopupBox';
import { PopupBoxList } from '../../PopupBox';
import { MdAddToDrive } from 'react-icons/md';
import { RiDropboxLine } from 'react-icons/ri';
import RemoteFileUploader from './RemoteFileUploader';
import { motion, AnimatePresence } from 'framer-motion';

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

export type RemoteFileRenderArgs = { remote: 'DRIVE' | 'DROPBOX' };

function UploadBtn(props: Props) {
  const { fn, numFiles, isConn, sx, IconForBtn } = props;
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const [popUpBox, setPopBox] = useState<boolean>(false);
  const [popupBoxList, setPopupBoxList] = useState<
    PopupBoxList<RemoteFileRenderArgs>[] | null
  >(null);

  const showPopupBox = (e: React.MouseEvent) => {
    e.stopPropagation();

    const popupBoxList: PopupBoxList<RemoteFileRenderArgs>[] = [
      {
        text: 'Import from Google Drive',
        avatar: MdAddToDrive,
        cb: RemoteFileUploader.bind(null, { remote: 'DRIVE' }),
      },

      {
        text: 'Import from Dropbox',
        avatar: RiDropboxLine,
        cb: RemoteFileUploader.bind(null, { remote: 'DROPBOX' }),
      },
    ];

    setPopupBoxList(popupBoxList);
    setPopBox(!popUpBox);
  };

  return (
    <>
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
            position: 'relative',

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
              {`${props.text} ${numFiles ? `(${numFiles})` : ''}`}
            </span>
          </Typography>
        </Box>

        {isConn && (
          <Button
            size="small"
            onClick={showPopupBox}
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
              <KeyboardArrowDownIcon
                style={{ width: '100%', height: '100%' }}
              />
            </Icon>
          </Button>
        )}
      </Button>

      <AnimatePresence>
        {popUpBox && (
          <Stack
            direction="row"
            component={motion.div}
            initial={{ scaleY: 0 }}
            transition={{
              ease: 'easeIn',
              duration: 0.2,
            }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            sx={{
              position: 'absolute',
              top: '33rem',
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <PopupBox
              listArr={popupBoxList as PopupBoxList<RemoteFileRenderArgs>[]}
            />
          </Stack>
        )}
      </AnimatePresence>
    </>
  );
}

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
  };
};

export default connect(mapStateToProps)(UploadBtn);
