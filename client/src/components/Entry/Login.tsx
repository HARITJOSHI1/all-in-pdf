import React, { ReactNode, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { alpha, Box, darken, Icon, Stack, TextField } from '@mui/material';
import { GMQ, State } from '../reducers';
import { motion } from 'framer-motion';
import Popup from '../Popup';
import { Context, UserQueueState } from '../Layout';
import OAuth from '../Auth';
import { useTimer } from '../hooks/useTimer';
import EntryForm from './EntryForm';
import SignUp from './SignUp';
import { connect } from 'react-redux';
import { NewUser } from '../actions';

interface Props {
  breakpoint: GMQ;
  children?: ReactNode;
  img?: string;
}

export const Renderqueue = (
  queue: UserQueueState[],
  type: string,
  props: Props
) => {
  const pop = queue?.find((e) => e.type === type) as UserQueueState;
  useTimer(type);

  if (pop) {
    return (
      <Popup
        breakpoint={props.breakpoint}
        err={`${pop.message}`}
        status={pop.status}
      />
    );
  } else return null;
};

function Login(props: Props) {
  const { queue } = useContext(Context)[2];
  const { setModal } = useContext(Context)[1];
  // useTimer('SIGNUP-ERR');

  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <Card
      key="card"
      component={motion.div}
      initial={{ scale: 0.4 }}
      transition={{
        ease: 'easeIn',
        duration: 0.2,
      }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      sx={[
        {
          bgcolor: 'white',
          //   height: "100%",
          width: mobile ? '90%' : '45%',
          opacity: '1',
          position: 'relative',
          zIndex: '100000',
          borderRadius: '12px',
        },

        tabPort && {
          width: '60%',
          height: 'auto',
        },
      ]}
    >
      <Stack
        direction="column"
        alignItems="center"
        sx={[{ height: '100%', maxHeight: '100%' }]}
      >
        <CardContent
          sx={[
            {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'start',
              p: '2.5rem',
              pb: '2.5rem !important',
              width: '100%',

              '& > :not(:last-child)': {
                marginBottom: '1.5rem',
              },
            },
            (tabPort || mobile) && { height: '100%', px: '2' },
          ]}
        >
          <Typography
            variant="h4"
            component="div"
            sx={[
              { fontSize: '1.8rem' },
              tabPort && { fontSize: '1.5rem' },
              mobile && { fontSize: '1.5rem' },
            ]}
          >
            Login
          </Typography>

          <OAuth breakpoint={props.breakpoint} />
          {Renderqueue(queue as UserQueueState[], 'LOGIN-ERR', props)}
          {props.children}

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={[
              { width: mobile ? '100%' : '65%' },
              tabLand && { width: '75%' },
              tabPort && { width: '75%' },
            ]}
          >
            <Typography
              component="span"
              sx={{
                color: '#5340FF',
                fontWeight: '500',
                fontSize: '.9rem',
                cursor: 'pointer',
              }}
            >
              Forgot password?
            </Typography>
            <Typography
              component="span"
              onClick={() =>
                setModal({
                  show: true,
                  fn: () => {
                    return (
                      <SignUp>
                        <EntryForm breakpoint={props.breakpoint} num={3} />
                      </SignUp>
                    );
                  },
                })
              }
              sx={{
                color: '#5340FF',
                fontWeight: '500',
                fontSize: '.9rem',
                cursor: 'pointer',
              }}
            >
              Create an account
            </Typography>
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  );
}

const mapStateToProps = (state: State) => {
  return { breakpoint: state.breakpoint as GMQ, user: state.user as NewUser };
};

export default connect(mapStateToProps)(Login);