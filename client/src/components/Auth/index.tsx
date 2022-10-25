import { Stack, Button, darken, Typography, Icon } from '@mui/material';
import React, { useContext } from 'react';
import { GMQ } from '../reducers';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { IconType } from 'react-icons';
import OAuthFlow from '../Auth/OAuth';
import { GoogleAuthProvider, FacebookAuthProvider, User } from 'firebase/auth';

import { connect } from 'react-redux';
import { addGlobalUser, NewUser, UserData } from '../actions';
import axios, { AxiosResponse } from 'axios';

import { Context } from '../Layout';
import { firebase } from '../../firebaseInit';

interface Props {
  breakpoint: GMQ;
  addGlobalUser: (user: NewUser | null) => UserData;
}

interface OAuthData {
  name?: string | null;
  email?: string | null;
  profilePic?: string | null;
}

const OAuth: React.FC<Props> = (props: Props) => {
  const { setModal } = useContext(Context)[1];
  const { setErr, errors } = useContext(Context)[2];
  const { showLogin } = useContext(Context)[3];

  const callOAuth = async (to: string) => {
    const services = to.toLowerCase();
    let user: User | null = null;

    try {
      switch (services) {
        case 'google':
          user = await new OAuthFlow(new GoogleAuthProvider()).OAuth();
          break;
        case 'facebook':
          user = await new OAuthFlow(new FacebookAuthProvider()).OAuth();
          break;
      }

      const newUser: OAuthData = Object.assign(
        {},
        {
          name: user?.displayName,
          email: user?.email,
          profilePic: user?.photoURL,
        }
      );

      const ack = await sendUserInfo(newUser);

      if (ack.data) {
        props.addGlobalUser(ack.data.user);
        setModal(false);
      }

      // else throw new Error(ack);
    } catch (err: any) {
      let message: string = err?.response?.data.message || err.message;
      
      const currentUser = firebase.auth().currentUser as User;
      await firebase.deleteUser(currentUser).then(() => {
        props.addGlobalUser(null);
      });

      if (message.match('Firebase')) message = 'Something went wrong';
      if (showLogin && errors)
        setErr([...errors, { type: 'LOGIN-ERR', message }]);
      else if (!showLogin && errors)
        setErr([...errors, { type: 'SIGNUP-ERR', message }]);
      else if (showLogin) setErr([{ type: 'LOGIN-ERR', message }]);
      else setErr([{ type: 'SIGNUP-ERR', message }]);
    }
  };

  async function sendUserInfo(user: OAuthData) {
    let res: AxiosResponse<{user: NewUser}> | null = null;
    if (showLogin) {
      res = await axios.post<{user: NewUser}>('/api/v1/entry/login', user, {
        withCredentials: true,
      });
    } else {
      res = await axios.post<{user: NewUser}>('/api/v1/entry/signUp', user, {
        withCredentials: true,
      });
    }

    return res;
  }

  const generateOAuth = () => {
    type Ic = {
      icon: IconType;
      color?: string;
      text: string;
    };

    const arr: Ic[] = [
      {
        icon: BsFacebook,
        color: '#3b5998',
        text: 'Facebook',
      },
      {
        icon: FcGoogle,
        text: 'Google',
      },
    ];

    return arr.map((item: Ic, idx: number) => {
      return (
        <Button
          key={idx}
          variant="contained"
          color="primary"
          onClick={() => callOAuth(item.text)}
          sx={{
            position: 'relative',
            bgcolor: '#EFF0F4',
            boxShadow: 'none',
            borderRadius: '10px',
            textTransform: 'none',
            width: '100%',
            color: 'black',

            '&:hover': {
              backgroundColor: darken('#EFF0F4', 0.1),
              boxShadow: 'none',
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon
              sx={{
                color: item?.color,
                width: 'auto',
                height: 'auto',
                alignSelf: 'stretch',
                fontSize: '1.2rem',
              }}
            >
              <item.icon style={{ width: '100%', height: '100%' }} />
            </Icon>

            <Typography variant="h6" sx={{ fontSize: '.9rem' }}>
              {item.text}
            </Typography>
          </Stack>
        </Button>
      );
    });
  };

  const { tabLand, desktop } = props.breakpoint;
  return (
    <Stack
      direction={desktop || tabLand ? 'row' : 'column'}
      justifyContent="space-between"
      spacing={2}
      alignItems="center"
      sx={{
        mt: '1rem',
        width: '100%',
        pb: desktop || tabLand ? '2rem' : '0',
      }}
    >
      {generateOAuth()}
    </Stack>
  );
};

export default connect(null, { addGlobalUser })(OAuth);
