import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useForm, SubmitHandler, Controller, FormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, darken, Stack, TextField, Typography } from '@mui/material';
import { GMQ, State } from '../reducers';
import axios, { AxiosResponse } from 'axios';
import { Grid } from 'react-loader-spinner';
import { connect } from 'react-redux';
import { addGlobalUser, UserData, NewUser } from '../actions';
import { Context, UserErrorState } from '../Layout';
import { firebase } from '../../firebaseInit';
import { User } from 'firebase/auth';

const Schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(14).required(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

interface Props {
  breakpoint: GMQ;
  addGlobalUser: (user: NewUser) => UserData;
  num: number;
}

export interface SignUpState {
  email: string;
  password: string;
  confirmPassword?: string;
}

const SignUp: React.FC<Props> = (props: Props) => {
  const { setErr, errors } = useContext(Context)[2];
  const { showLogin } = useContext(Context)[3];
  const {setModal} = useContext(Context)[1];

  const { control, handleSubmit, formState } = useForm<SignUpState>({
    resolver: yupResolver(Schema),
  });

  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const [isSubmit, setSubmit] = useState(false);

  const onSubmit: SubmitHandler<SignUpState> = async (data: SignUpState) => {
    if (!isSubmit) {
      let res: AxiosResponse<{user: NewUser}> | null = null;

      try {
        setSubmit(true);

        switch (showLogin) {
          case false:
            res = await axios.post<{user: NewUser}>(
              '/api/v1/entry/signup',
              data,
              { withCredentials: true }
            );
            break;

          default:
            res = await axios.post<{user: NewUser}>('/api/v1/entry/login', data, {
              withCredentials: true,
            });
        }

        if (res.data) {
          const auth = firebase.auth();
          const { user } = await firebase.createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );

          await firebase.updateProfile(user, {
            photoURL: 'https://www.gravatar.com/avatar/?d=mp',
          });

          props.addGlobalUser(res.data.user);
          setSubmit(false);
          setModal({show: false, fn: () => null});
        }
        setSubmit(false);
      } catch (err: any) {
        setSubmit(false);

        let message: string = err?.response?.data?.message || err.message;
        console.log(message);
        if (message.match('Firebase')) message = 'Something went wrong';

        if (showLogin && errors)
          setErr([...errors, { type: 'LOGIN-ERR', message }]);
        else if (!showLogin && errors)
          setErr([...errors, { type: 'SIGNUP-ERR', message }]);
        else if (showLogin) 
          setErr([{ type: 'LOGIN-ERR', message }])
        else setErr([{ type: 'SIGNUP-ERR', message }]);
      }
    }
  };

  const createLabel = (l: string, i: number) => {
    const newStr = l.replace(l[0], l[0].toUpperCase());
    if (i === 2) {
      return newStr.replace('P', ' P');
    }

    return newStr.replace(l[0], l[0].toUpperCase());
  };

  const generateInputText = (
    { errors }: FormState<SignUpState>,
    num: number
  ) => {
    const labels: ('email' | 'password' | 'confirmPassword')[] = [
      'email',
      'password',
      'confirmPassword',
    ];
    return labels.map(
      (l: 'email' | 'password' | 'confirmPassword', idx: number) => {
        if (idx < num) {
          return (
            <Controller
              name={l}
              key={idx}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  size="small"
                  sx={{ width: '100%' }}
                  label={createLabel(l, idx)}
                  error={!!errors.email}
                  FormHelperTextProps={{
                    style: {
                      marginTop: '0.25rem',
                      marginBottom: '0.25rem',
                    },
                  }}
                  helperText={errors[l] ? errors[l]?.message : ' '}
                />
              )}
            />
          );
        } else return null;
      }
    );
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={[
        { width: '100%' },
        tabPort && { width: '90%' },
        mobile && { width: '100%' },
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        {generateInputText(formState, props.num)}

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
            mt: desktop || tabLand ? '1rem' : '0',
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
              {showLogin ? 'Login' : 'Submit'}
            </Typography>
          ) : (
            <Grid
              ariaLabel="loading-indicator"
              color="white"
              width="1.5rem"
              height="1.5rem"
            />
          )}
        </Button>
      </form>
    </Stack>
  );
};

export default connect(null, { addGlobalUser })(SignUp);
