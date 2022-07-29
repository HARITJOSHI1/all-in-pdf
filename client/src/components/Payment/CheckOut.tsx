import {
  Stack,
  Typography,
  Box,
  Grid,
  TextField,
  styled,
  Button,
  Icon,
} from '@mui/material';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, FormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  StripeCardElementOptions,
  StripeElementChangeEvent,
  StripeElementType,
} from '@stripe/stripe-js';
import { Grid as Loader } from 'react-loader-spinner';
import { IoLockClosed } from 'react-icons/io5';
import { darken } from '@material-ui/core/styles';
import { User } from 'firebase/auth';
import { FormDataUser, NewUser } from '../actions';
import axios, { AxiosResponse } from 'axios';
import { useProtectRefresh } from '../hooks/protectRefresh';
import { Context, UserErrorState } from '../Layout';
import { useTime } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { RenderErrors } from '../Entry/Login';
import { GMQ } from '../reducers';

const ContactTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'red',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e8e7e6',
    },
    '&:hover fieldset': {
      borderColor: '#e8e7e6',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid #e8e7e6',
    },
  },

  '& .MuiFormLabel-root': {
    color: '#c3d8fa',
  },

  '& .MuiInputBase-input': {
    color: '#757473',
  },

  '& .MuiFormHelperText-contained': {
    margin: '0',
  },
});

const Schema = Yup.object().shape({
  userName: Yup.string().required(),
  address: Yup.string().required(),
  zip: Yup.string()
    .required()
    .length(6, 'Zip should be of 6 digits')
    .test('test_number', 'Enter 6 digit pin number only', (value) =>
      /^\d+$/.test(value as string)
    ),
});

interface AddDetails {
  userName: string;
  address: string;
  zip: number;
  card: string;
  expires: string;
  cvc: string;
}

const cardStyleOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '1.2rem',
      fontFamily: 'Plus Jakarta Sans',
      color: '#757473',

      '::placeholder': {
        color: '#cccccc',
      },
    },

    invalid: {
      color: '#D32F2F',
    },
  },
};

type CardError = Record<StripeElementType, string | undefined | null>;

interface Props {
  user: NewUser;
  breakpoint: GMQ
}

type UserAddress = {
  city: string;
  country: string;
};

export default function CheckOut(props: Props) {
  const { control, formState, handleSubmit } = useForm<AddDetails>({
    resolver: yupResolver(Schema),
  });

  const { errors, setErr } = useContext(Context)[2];
  // useTimer({ errors, setErr }, 'PAY-ERR');
  // console.log(errors);
  

  const { error } = useProtectRefresh({
    refresh: '/api/v1/token/refresh',
    user: props.user,
    stopRetries: false,
  });

  const [countryInfo, setCountryInfo] = useState<UserAddress>();
  const [isSubmit, setSubmit] = useState(false);

  const getLatLng = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          return resolve(pos);
        },
        (err) => reject(err)
      );
    });
  };

  const getAddress = async () => {
    try {
      const { coords } = await getLatLng();
      const res = await axios.get(
        'http://api.openweathermap.org/geo/1.0/reverse',
        {
          params: {
            lat: String(coords.latitude),
            lon: String(coords.longitude),
            appid: '7edd0db06b172f517845c2f10671666d',
          },
        }
      );

      return res;
    } catch (error: any) {
      return error as AxiosResponse;
    }
  };

  useEffect(() => {
    getAddress().then(({ data }) => {
      if (data) {
        const obj = {
          city: data[0].state,
          country: data[0].country,
        };
        setCountryInfo(obj);
      }
    });
  }, []);

  const [stripeErrorState, setError] = useState<CardError>({
    cardNumber: null,
    cardExpiry: null,
    cardCvc: null,
  } as CardError);

  const handleStripeError = (e: StripeElementChangeEvent) => {
    const err = {
      ...stripeErrorState,
      [e.elementType]: e.error?.message,
    } as CardError;
    setError(err);
  };

  const stripe = useStripe();
  const elements = useElements(); 

  const submitPayment: SubmitHandler<AddDetails> = async (data) => {
    if (!stripe || !elements) return;
    if (isSubmit) return;

    try {
      const cardNumber = elements?.getElement('cardNumber')!;
      setSubmit(true);

      if (error) throw new Error(error.response?.data as string);

      const Method = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          name: data.userName,
          address: {
            line1: data.address,
            postal_code: String(data.zip),
            city: (countryInfo as UserAddress).city,
            country: (countryInfo as UserAddress).country,
            state: (countryInfo as UserAddress).city,
          },
          email: props.user.email!,
        },
      });

      console.log(Method);

      const payment_intent = await axios.post(
        '/api/v1/superpdf/payment/charge',
        {
          payment_method: Method,
          email: props.user.email!,
          timeUp: Math.floor(new Date().getTime() / 1000),
        },
        {
          params: {
            method: 'subscription',
            mode: 'trial',
          },
          withCredentials: true,
        }
      );

      console.log(payment_intent);
      

      if(payment_intent.data.status === "active"){
        const {message} = payment_intent.data;
         if (errors)
           setErr([...errors, { type: 'PAY-ERR', message }]);
         else setErr([{ type: 'PAY-ERR', message }]);
      }

      if (payment_intent && Method.paymentMethod) {
        const { client_secret, status, customerId, createdAt, reccur } = payment_intent.data.data;
        if (status === 'requires_action') {
          const result = await stripe.confirmCardPayment(client_secret);
  
          if (result.error) throw new Error(result.error.message);
          axios.post(
            `/api/v1/superpdf/payment/${customerId}/create`,
            {
              priceForSub: 'price_1LO1TJSDlhCRlZPcKQlro1aY',
              customerId,
              createdAt,
              reccur,
              transactionId: Method.paymentMethod.id
            },
            { withCredentials: true }
          );
        }

        alert('Success Subscribed');
        setSubmit(false);
      }
    } 
    
    catch (err: any) {
      setSubmit(false);
      let message: string = err?.response?.data.message || err.message;
      if (message && errors)
        setErr([...errors, { type: 'PAY-ERR', message }]);
      else if(message) {
        setErr([{ type: 'PAY-ERR', message }]);
      }

    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitPayment)}
      style={{
        width: '100%',
        backgroundColor: '#F7F8F9',
        borderRadius: '6px',
        padding: '2rem 1.2rem',
      }}
    >
      {RenderErrors(errors as UserErrorState[], 'PAY-ERR', props)}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Controller
            name="card"
            key={1}
            control={control}
            render={({ field }) => (
              <Stack direction="column" spacing={1}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  Card Details
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${
                      !stripeErrorState?.cardNumber ? '#e8e7e6' : '#D32F2F'
                    }`,
                    borderRadius: '3px',
                    fontSize: '1.2rem',
                    p: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  <CardNumberElement
                    {...field}
                    options={cardStyleOptions}
                    onChange={(e) => handleStripeError(e)}
                  />
                </Box>

                {stripeErrorState?.cardNumber && (
                  <span
                    id="card-errors"
                    role="alert"
                    style={{ color: '#D32F2F', fontSize: '.8rem' }}
                  >
                    {stripeErrorState?.cardNumber}
                  </span>
                )}
              </Stack>
            )}
          />
        </Grid>

        <Grid item xs={5} sm={5}>
          <Controller
            name="expires"
            key={2}
            control={control}
            render={({ field }) => (
              <Stack {...field} direction="column" spacing={1}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  Expires
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${
                      !stripeErrorState?.cardExpiry ? '#e8e7e6' : '#D32F2F'
                    }`,
                    borderRadius: '3px',
                    fontSize: '1.2rem',
                    p: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  <CardExpiryElement
                    options={cardStyleOptions}
                    onChange={(e) => handleStripeError(e)}
                  />
                </Box>

                {stripeErrorState?.cardExpiry && (
                  <span
                    id="card-errors"
                    role="alert"
                    style={{ color: '#D32F2F', fontSize: '.8rem' }}
                  >
                    {stripeErrorState?.cardExpiry}
                  </span>
                )}
              </Stack>
            )}
          />
        </Grid>

        <Grid item xs={7} sm={7}>
          <Controller
            name="cvc"
            key={3}
            control={control}
            render={({ field }) => (
              <Stack {...field} direction="column" spacing={1}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  CVC
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${
                      !stripeErrorState?.cardCvc ? '#e8e7e6' : '#D32F2F'
                    }`,
                    borderRadius: '3px',
                    fontSize: '1.2rem',
                    p: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  <CardCvcElement
                    options={cardStyleOptions}
                    onChange={(e) => handleStripeError(e)}
                  />
                </Box>

                {stripeErrorState?.cardCvc && (
                  <span
                    id="card-errors"
                    role="alert"
                    style={{ color: '#D32F2F', fontSize: '.8rem' }}
                  >
                    {stripeErrorState?.cardCvc}
                  </span>
                )}
              </Stack>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Controller
            name="userName"
            key={5}
            control={control}
            render={({ field }) => (
              <Stack direction="column" spacing={1}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  Name
                </Typography>

                <ContactTextField
                  {...field}
                  required
                  placeholder="Name"
                  multiline
                  maxRows={4}
                  error={!!formState.errors.zip}
                  FormHelperTextProps={{
                    style: {
                      margin: '0 !important',
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#F7F8F9',
                    },
                  }}
                  helperText={
                    formState.errors.userName
                      ? formState.errors.userName?.message
                      : undefined
                  }
                  sx={{
                    borderRadius: '3px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Controller
            name="address"
            key={4}
            control={control}
            render={({ field }) => (
              <Stack direction="column" spacing={1}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  Address
                </Typography>

                <ContactTextField
                  {...field}
                  required
                  placeholder="11/3 Ellen Street ..."
                  multiline
                  maxRows={4}
                  error={!!formState.errors.address}
                  FormHelperTextProps={{
                    style: {
                      marginTop: '0 !important',
                      marginBottom: '0 !important',
                      marginLeft: '0 !important',
                      marginRight: '0 !important',
                      width: '100%',
                      backgroundColor: '#F7F8F9',
                    },
                  }}
                  helperText={
                    formState.errors.address
                      ? formState.errors.address?.message
                      : undefined
                  }
                  sx={{
                    borderRadius: '3px',
                    fontSize: '1.2rem',
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Controller
            name="zip"
            key={5}
            control={control}
            render={({ field }) => (
              <Stack direction="column" spacing={1} sx={{ mb: '2rem' }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#4d4c4b',
                  }}
                >
                  Zip
                </Typography>

                <ContactTextField
                  {...field}
                  required
                  placeholder="110007"
                  multiline
                  maxRows={4}
                  error={!!formState.errors.zip}
                  FormHelperTextProps={{
                    style: {
                      margin: '0 !important',
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#F7F8F9',
                    },
                  }}
                  helperText={
                    formState.errors.zip
                      ? formState.errors.zip?.message
                      : undefined
                  }
                  sx={{
                    borderRadius: '3px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                />
              </Stack>
            )}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        type="submit"
        sx={{
          backgroundColor: '#00112C',
          p: '.8rem !important',
          borderRadius: '12px',
          width: '100%',
          textTransform: 'none',

          '&:hover': {
            backgroundColor: darken('#00112C', 0.4),
          },
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!isSubmit ? (
            <>
              <Icon sx={{ width: '2rem', height: '2rem', mr: '.5rem' }}>
                <IoLockClosed width="100%" height="100%" />
              </Icon>

              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                Pay $ 0.00
              </Typography>
            </>
          ) : (
            <Loader
              ariaLabel="loading-indicator"
              color="white"
              width="1.8rem"
              height="1.8rem"
            />
          )}
        </Typography>
      </Button>
    </form>
  );
}
