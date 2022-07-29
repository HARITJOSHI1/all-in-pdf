import React, { useEffect, useState } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tools } from './tools';
import { Layout } from './Layout';
import { history } from './history';
import {
  createTheme,
  CssBaseline,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import {
  addGlobalMediaQ,
  AdddMediaQ,
  addGlobalUser,
  UserData,
  NewUser,
} from './actions';
import { GMQ, State } from './reducers';
import HomePage from './HomePage';
import CircularProgress from '@mui/material/CircularProgress';
import Operation from './PDFOps/Operation';
import Subscribe from './Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useProtectRefresh } from './hooks/protectRefresh';
import SelectPlan from './Payment/SelectPlan';

axios.defaults.baseURL = 'http://localhost:5000';

const stripePromise = loadStripe(
  'pk_test_51LJxnCSDlhCRlZPczxYMd2i6J8wIZM1TYnvcEjtpJ2hWZyT0snYiPrrlGHA07KXc6tihJVdhnqB8uTIjCx4uRCYj00hLRuXpnS'
);

interface Props {
  addGlobalMediaQ: (q: Record<keyof GMQ, boolean>) => AdddMediaQ;
  addGlobalUser: (user: NewUser) => UserData;
  user: NewUser;
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tabLand: true;
    tabPort: true;
    laptop: true;
    desktop: true;
  }
}

const App: React.FC<Props> = (props) => {
  const [flag, setFlag] = useState<number>(0);
  let [load, setLoad] = useState<boolean>(true);
  const { data, error } = useProtectRefresh({
    refresh: '/api/v1/token/refresh',
    proute: '/api/v1/entry/me',
    user: {},
    stopRetries: false,
  });

  if (data && !data.isloading) props.addGlobalUser(data.result?.data.data);

  useEffect(() => {
    if (data?.result || error) setLoad(false);
  }, [data, error]);

  const theme = createTheme({
    breakpoints: {
      values: {
        mobile: 300,
        tabPort: 640,
        tabLand: 900,
        laptop: 1024,
        desktop: 1200,
      },
    },
  });

  const mobile = useMediaQuery(theme.breakpoints.up('mobile'));
  const tabPort = useMediaQuery(theme.breakpoints.up('tabPort'));
  const tabLand = useMediaQuery(theme.breakpoints.up('tabLand'));
  const desktop = useMediaQuery(theme.breakpoints.up('laptop'));

  const mediaArr = ['mobile', 'tabPort', 'tabLand', 'desktop'];

  const mediaObj: Record<number, Record<string, boolean>> = {};
  mediaArr.forEach((s: string, idx: number) => {
    mediaObj[idx] = { [s]: false };
  });

  useEffect(() => {
    if (mobile && !tabPort && !tabLand && !desktop) setFlag(0);
    else if (tabPort && !tabLand && !desktop) setFlag(1);
    else if (tabLand && !desktop) setFlag(2);
    else if (desktop) setFlag(3);
  }, [mobile, tabPort, tabLand, desktop]);

  const key = Object.keys(mediaObj[flag])[0];
  mediaObj[flag][key] = true;
  props.addGlobalMediaQ(mediaObj[flag]);

  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
            },
          ],
        }}
      >
        <Router history={history}>
          <Switch>
            {load && (
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ bgcolor: 'white', height: '100vh' }}
              >
                <CircularProgress
                  sx={{ width: '5rem !important', height: '5rem !important' }}
                />
              </Stack>
            )}

            <Route
              path="/superpdf/premium/select-plan"
              exact
              // component={SelectPlan}
              render={() =>
                props.user ? (
                  <Redirect to="/superpdf/premium/select-plan" />
                ) : (
                  <Redirect to="/" />
                )
              }
            />

            <Route
              path="/superpdf/premium/subscribe"
              exact
              component={Subscribe}
            />

            <Layout>
              <Route path="/" exact component={HomePage} />
              <Route path="/tools" exact component={Tools} />
              <Route path="/operation/:name" exact component={Operation} />
            </Layout>
          </Switch>
        </Router>
      </Elements>
    </>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: state.user as NewUser,
  };
};

export default connect(mapStateToProps, { addGlobalMediaQ, addGlobalUser })(
  App
);
