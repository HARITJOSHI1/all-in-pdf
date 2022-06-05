import React, { useEffect, useState } from "react";
import { Router, Route, Switch} from "react-router-dom";
import { connect } from "react-redux";
import { Tools } from "./tools";
import { Layout } from "./Layout";
import { history } from "./history";
import { createTheme, useMediaQuery } from "@mui/material";
import { addGlobalMediaQ, AdddMediaQ } from "./actions";
import { GMQ } from "./reducers";
import HomePage from "./Sections";

interface Props {
  addGlobalMediaQ: (q: Record<keyof GMQ, boolean>) => AdddMediaQ;
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
          <Layout>
            <Route path = "/" exact component={HomePage} />
            <Route path="/tools" exact component={Tools} />
          </Layout>
        </Switch>
      </Router>
    </>
  );
};

export default connect(null, { addGlobalMediaQ })(App);
