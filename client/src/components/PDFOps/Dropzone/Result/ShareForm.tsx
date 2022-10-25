import {
  Button,
  darken,
  Grid,
  Icon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useForm, SubmitHandler, Controller, FormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { GMQ, State } from '../../../reducers';
import axios, { AxiosResponse } from 'axios';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { Grid as LoaderGrid } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import { Context, UserQueueState } from '../../../Layout';
import { Renderqueue } from '../../../Entry/Login';
import { connect } from 'react-redux';
import { NewUser } from '../../../actions';
import SendMailPng from './icons/SendMsg.png';
import { useProtectRefresh } from '../../../hooks/protectRefresh';

interface Props {
  breakpoint: GMQ;
  response: AxiosResponse;
  user: NewUser;
}

export interface ComposeEmail {
  se: string;
  re: string;
  body?: string;
}

const Schema = Yup.object().shape({
  se: Yup.string()
    .email('email is not valid')
    .required("sender 's email must be provided"),
  re: Yup.string()
    .email('email is not valid')
    .required("reciever 's email must be provided"),
  body: Yup.string().max(200, 'characters should be less than 200'),
});

const ShareForm: React.FC<Props> = (props) => {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const { control, handleSubmit, formState } = useForm<ComposeEmail>({
    resolver: yupResolver(Schema),
  });

  const [isSubmit, setSubmit] = useState(false);

  const { setPopup, queue } = useContext(Context)[2];
  const { setModal } = useContext(Context)[1];

  // const { error } = useProtectRefresh({
  //   refresh: '/api/v1/token/refresh',
  //   user: props.user,
  //   stopRetries: false,
  // });

  const onSubmit: SubmitHandler<ComposeEmail> = async ({
    se: user,
    re: to,
    body: message,
  }) => {
    if (!isSubmit) {
      try {
        setSubmit(true);
        const res = await axios.post(
          '/api/v1/media/share/email',
          {
            from: props.user?.email || user,
            to,
            message,
          },
          {
            withCredentials: true,
          }
        );

        if (res.data) {
          console.log(res.data);
          setPopup([
            {
              type: 'SHARE-POP',
              message: res.data?.message,
              status: true,
            },
          ]);

          setSubmit(false);
        }
      } catch (err: any) {
        setSubmit(false);
        let message: string = err?.response?.data?.message || err.message;
        if (!queue) setPopup([{ type: 'SHARE-POP', message }]);
        else setPopup([...queue, { type: 'SHARE-POP', message }]);
      }
    }
  };

  return (
    <Grid
      container
      component={motion.div}
      initial={{ scale: 0 }}
      transition={{
        ease: 'easeIn',
        duration: 0.255,
      }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      sx={[
        {
          witdh: '100%',
          backgroundColor: 'white',
          position: 'relative',
          zIndex: '100000',
          borderRadius: '12px',
          height: 'auto',
          aspectRatio: desktop ? '16/9' : '',
        },
        (tabLand || mobile) && { width: '90%' },
        tabPort && { width: '80%' },
      ]}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={7}
        lg={7}
        sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}
      >
        <Stack
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ py: '2rem', width: '85%' }}
        >
          <Typography
            variant="h4"
            sx={[
              { textAlign: 'center', mb: '1rem' },
              mobile && { fontSize: '2rem' },
            ]}
          >
            Compose email
          </Typography>

          <Stack
            direction="row"
            sx={{
              width: '100%',
              bgcolor: '#bbd9f2 ',
              border: '1px dashed #3f7fd9',
              borderRadius: '2rem',
              px: '1rem',
            }}
          >
            <FolderZipIcon style={{ color: '#3f7fd9' }} />
            <Typography
              sx={[
                { fontSize: '1.1rem', color: '#3f7fd9', ml: '.5rem' },
                mobile && { fontSize: '.9rem' },
              ]}
            >
              {(props.response.data.data as string).slice(0, 25)} ...zip
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            {Renderqueue(queue as UserQueueState[], 'SHARE-POP', props)}

            <Controller
              name="se"
              key={1}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  size="small"
                  sx={{ width: '100%' }}
                  label="from"
                  error={!!formState.errors.se}
                  FormHelperTextProps={{
                    style: {
                      marginTop: '0.25rem',
                      marginBottom: '0.25rem',
                    },
                  }}
                  helperText={
                    formState.errors.se ? formState.errors.se?.message : ' '
                  }
                />
              )}
            />

            <Controller
              name="re"
              key={2}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  size="small"
                  sx={{ width: '100%' }}
                  label="to"
                  error={!!formState.errors.re}
                  value={props.user ? props.user.email : null}
                  FormHelperTextProps={{
                    style: {
                      marginTop: '0.25rem',
                      marginBottom: '0.25rem',
                    },
                  }}
                  helperText={
                    formState.errors.re ? formState.errors.re?.message : ' '
                  }
                />
              )}
            />

            <Controller
              name="body"
              key={3}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={8}
                  size="small"
                  sx={{ width: '100%' }}
                  label="body"
                  error={!!formState.errors.body}
                  FormHelperTextProps={{
                    style: {
                      marginTop: '0.25rem',
                      marginBottom: '0.25rem',
                    },
                  }}
                  helperText={
                    formState.errors.body ? formState.errors.body?.message : ' '
                  }
                />
              )}
            />

            <Button
              variant="contained"
              type="submit"
              sx={{
                position: 'relative',
                bgcolor: '#5340FF',
                boxShadow: 'none',
                borderRadius: '10px',
                textTransform: 'none',
                width: '100%',
                p: '.8rem 4rem',
                '&:hover': {
                  bgcolor: darken('#5340FF', 0.2),
                },
              }}
            >
              {!isSubmit ? (
                <Typography
                  style={{
                    fontWeight: '700',
                    fontSize: '1rem',
                  }}
                >
                  Send
                </Typography>
              ) : (
                <LoaderGrid
                  ariaLabel="loading-indicator"
                  color="white"
                  width="1.5rem"
                  height="1.5rem"
                />
              )}
            </Button>
          </form>
        </Stack>
      </Grid>

      {(desktop || tabLand) && (
        <Grid item xs={0} sm={0} md={5} lg={5}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            <img
              src={SendMailPng}
              alt="send mail icon"
              width="100%"
              height="auto"
            />
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = (state: State) => {
  return { breakpoint: state.breakpoint as GMQ, user: state.user as NewUser };
};

export default connect(mapStateToProps)(ShareForm);
