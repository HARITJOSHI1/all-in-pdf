import { ThemeProvider } from '@emotion/react';
import {
  createTheme,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { NewUser } from '../actions';
import Logo from '../Logo';
import { GMQ, State } from '../reducers';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { darken, makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles';
import { Link } from 'react-router-dom';

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

const useStyles = makeStyles({
  perMonth: {
    boxShadow: '-2px 10px 3px 7px #DFEDFA',
  },

  perYear: {
    boxShadow: '-2px 10px 3px 7px #F5EBF1',
  },
});

const PLANS = [
  {
    type: 'perMonth',
    bg: 'linear-gradient(144deg, rgba(105,246,195,1) 14%, rgba(88,197,217,1) 45%, rgba(45,126,238,1) 60%)',
    price: '7.0',
    list: [
      'Unlimited Downloads',
      'Unlimited Sharing files',
      'Unlock Premium Features',
    ],

    btnShadow: '0px 8px 20px #7faff0',
    btnCol: '#2D7EEE',
  },

  {
    type: 'perYear',
    bg: 'linear-gradient(144deg, rgba(255,137,127,1) 14%, rgba(246,135,128,1) 45%, rgba(199,78,105,1) 60%)',
    price: '2562.0',
    list: [
      'Unlimited Downloads',
      'Unlimited Sharing files',
      'Unlock Premium Features',
    ],

    btnShadow: '0px 8px 20px #f2a08a',
    btnCol: '#df847f',
  },
];

const PlanInc = (p: string[]) => {
  return p.map((s, i: number) => {
    return (
      <ListItem sx={{ textAlign: 'center' }}>
        <ListItemText
          primary={s}
          disableTypography
          sx={{
            fontSize: '1rem',
            color: '#c7e9ef',
          }}
        />
      </ListItem>
    );
  });
};

const GeneratePlanCards = (classes: ClassNameMap, vp: GMQ): ReactNode => {
  const { mobile, tabLand, tabPort, desktop } = vp;
  return PLANS.map((ele, idx: number) => {
    return (
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <Stack
          direction={mobile ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          sx={{ px: mobile ? '1rem' : '4rem', py: '2rem' }}
        >
          <Card
            className={classes[ele.type]}
            sx={[
              {
                borderRadius: '10px',
                width: '70%',
                overflow: 'unset',
                position: 'relative',
                background: ele.bg,
                mb: '2rem',
              },
              (tabPort || tabLand) && { width: '80%' },
              mobile && { width: '100%' },
            ]}
          >
            <CardContent>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={5}
                sx={{ px: mobile ? '0' : '2rem', py: '6rem' }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 100,
                    fontSize: mobile ? '4rem' : '5rem',
                    display: 'flex',
                    flexDirection: 'row',
                    color: 'white',
                    ml: '3rem',
                  }}
                >
                  {ele.price}
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 400,
                      marginLeft: '.5rem',
                      marginTop: '1rem',
                      color: 'white',
                    }}
                  >
                    $/mon
                  </span>
                </Typography>

                <Typography>
                  <List component="div">{PlanInc(ele.list)}</List>
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                  }}
                >
                  {' '}
                  Subscription starts as you pay
                </Typography>
              </Stack>
            </CardContent>

            <CardActions
              sx={{
                position: 'absolute',
                bottom: '-2rem',
                left: '50%',
                transform: 'translate(-50%)',
              }}
            >
              <Link to="/superpdf/premium/subscribe" style = {{textDecoration: "none"}}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'white',
                    boxShadow: ele.btnShadow,
                    color: ele.btnCol,
                    fontWeight: 900,
                    p: '1rem 3rem',
                    borderRadius: '5rem',
                    letterSpacing: '1.2px',

                    ':hover': {
                      backgroundColor: '#dde1e8',
                      boxShadow: ele.btnShadow,
                    },
                  }}
                >
                  Upgrade
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Stack>
      </Grid>
    );
  });
};

const SelectPlan: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { mobile, tabLand, tabPort, desktop } = props.breakpoints;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <section style={{ padding: desktop ? '0 2rem' : '0', height: '100vh' }}>
        <Grid container spacing= {(mobile|| tabPort)? 2: 5}>
          <Grid item xs={12} sm={12}>
            <Stack
              direction={mobile ? 'row' : 'column'}
              justifyContent="space-between"
              sx={{ mb: desktop ? '0' : '3.5rem', mt: '2rem', ml: '1rem' }}
            >
              <Logo />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12} md = {12} lg= {12}>
            <Typography variant= "h3" sx = {{color: "secondary.dark", textAlign: "center", fontSize: mobile? "2.5rem" : "3rem"}}>
              Be our premium member
            </Typography>
          </Grid>

          {GeneratePlanCards(classes, props.breakpoints)}
        </Grid>
      </section>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: State) => {
  return { breakpoints: state.breakpoint as GMQ, user: state.user as NewUser };
};

export default connect(mapStateToProps)(SelectPlan);
