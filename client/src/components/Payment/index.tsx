import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Grid, Stack, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { GMQ, State } from '../reducers';
import Logo from '../Logo';
import Select from 'react-select';
import { PAYMENT_OPTIONS } from './Select/PaymentOpt';
import { customStyles } from './Select/Styles';
import CheckOutForm from './CheckOut';
import CheckOutImg from './icons/checkoutImg.png';
import { NewUser } from '../actions';

/* 

Form needs 
- card number (DC/CC),
- validity of card
- CVV
- address
- zip
- wallets (optional)
- re-captcha

*/

const theme = createTheme({
  typography: {
    h1: {
      color: '#2D3246',
    },

    h2: {
      color: '#2D3246',
      fontWeight: '700',
    },

    h3: {
      color: '#2D3246',
      fontWeight: '700',
    },

    h4: {
      fontWeight: '700',
      color: '#2D3246',
    },

    h5: {
      '@media (min-width: 300px)': {
        fontSize: '1.2rem',
      },

      color: '#2D3246',
    },

    fontFamily: 'Plus Jakarta Sans',
  },

  palette: {
    primary: {
      main: '#3b4252',
    },

    secondary: {
      main: '#0044ff',
      dark: '#2D3246',
      light: '#CECFD3',
    },
  },
});

interface Props {
  breakpoints: GMQ;
  user: NewUser;
}

const Trial: React.FC<Props> = (props) => {
  const { mobile, tabLand, tabPort, desktop } = props.breakpoints;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <section style={{ padding: desktop ? '0 2rem' : '0', height: '100vh' }}>
        <Stack
          direction={mobile ? 'row' : 'column'}
          justifyContent="space-between"
          sx={{ mb: desktop ? '0' : '3.5rem', mt: '2rem', ml: '1rem' }}
        >
          <Logo />
        </Stack>

        <Grid container sx={{ height: '85%' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            sx={[
              desktop && {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                pt: '8rem',
              },
            ]}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={[
                desktop && {
                  position: 'relative',
                  width: '95%',
                },
                tabLand && { px: '10rem' },
                tabPort && { px: '4rem' },
                mobile && { px: '1rem' },
              ]}
              spacing={4}
            >
              <Typography variant="h4">Select payment method</Typography>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <Select
                  options={PAYMENT_OPTIONS}
                  defaultValue={PAYMENT_OPTIONS[0]}
                  styles={customStyles}
                  isSearchable={false}
                />
              </Box>
            </Stack>

            {desktop && (
              <Box sx={{ width: '30rem', height: '30rem' }}>
                <img
                  src={CheckOutImg}
                  alt="checkout"
                  width="100%"
                  height="100%"
                />
              </Box>
            )}
          </Grid>

          {desktop && (
            <Grid item xs={12} sm={12} lg={4}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={4}
                sx={[
                  {
                    height: '100%',
                    position: 'relative',
                    top: '-6rem',
                    px: '2rem',
                  },
                ]}
              >
                <Typography>
                  You will be enrolled in a subscription per month plan for
                  which we charge rs 7.
                </Typography>

                <Typography>
                  Within the premium period you can use all superpdf 's
                  exclusive features and can explore whole sets of
                  functionalities.
                </Typography>
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} sm={12} lg={4}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={[
                { height: '100%' },
                tabLand && { pt: '2rem', px: '10rem', mb: '2rem' },
                tabPort && { pt: '2rem', px: '4rem' },
                mobile && { pt: '2rem', px: '1rem', mb: '2rem' },
              ]}
            >
              <CheckOutForm user={props.user} breakpoint={props.breakpoints} />
            </Stack>
          </Grid>
        </Grid>
      </section>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: State) => {
  return { breakpoints: state.breakpoint as GMQ, user: state.user as NewUser };
};

export default connect(mapStateToProps)(Trial);
