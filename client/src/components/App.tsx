import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Tools } from "./tools";
import { Layout } from "./Layout";
import { history } from "./history";
import { createTheme, Stack, useMediaQuery } from "@mui/material";
import {
  addGlobalMediaQ,
  AdddMediaQ,
  addGlobalUser,
  UserData,
} from "./actions";
import { GMQ, State } from "./reducers";
import HomePage from "./HomePage";
import { firebase } from "../firebaseInit";
import { User } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  addGlobalMediaQ: (q: Record<keyof GMQ, boolean>) => AdddMediaQ;
  addGlobalUser: (user: User | null) => UserData;
}

declare module "@mui/material/styles" {
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
  load && localStorage.setItem("load", "1");

  useEffect(() => {
    const auth = firebase.auth();
    firebase.onAuthStateChanged(auth, (user) => {

      if (user && Number(localStorage.getItem("load"))){  
        props.addGlobalUser(user)
      }
      
      localStorage.setItem("load", "0");
      setLoad(false);
    });
  }, [load]);

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

  const mobile = useMediaQuery(theme.breakpoints.up("mobile"));
  const tabPort = useMediaQuery(theme.breakpoints.up("tabPort"));
  const tabLand = useMediaQuery(theme.breakpoints.up("tabLand"));
  const desktop = useMediaQuery(theme.breakpoints.up("laptop"));

  const mediaArr = ["mobile", "tabPort", "tabLand", "desktop"];

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
      <Router history={history}>
        <Switch>
          {load && (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{ bgcolor: "white", height: "100vh" }}
            >
              <CircularProgress
                sx={{ width: "5rem !important", height: "5rem !important" }}
              />
            </Stack>
          )}
          <Layout>
            <Route path="/" exact component={HomePage} />
            <Route path="/tools" exact component={Tools} />
          </Layout>
        </Switch>
      </Router>
    </>
  );
};

export default connect(null, { addGlobalMediaQ, addGlobalUser })(App);
