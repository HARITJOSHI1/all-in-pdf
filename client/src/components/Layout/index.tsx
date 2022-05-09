import {
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, createContext, useRef } from "react";
import { connect } from "react-redux";
import { NavBar } from "../Navbar";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Collapse from "@mui/material/Collapse";
// import { motion } from "framer-motion";
import { GMQ, State } from "../reducers";
import Footer from "../Footer";

type contextStore = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export const Context = createContext<contextStore>([false, () => {}]);

interface Props {
  breakpoint: GMQ;
  children?: JSX.Element[] | null;
}

const theme = createTheme({
  typography: {

    h1: {
      color: "#2D3246"
    },

    h2: {
      color: "#2D3246",
      fontWeight: "700"
    },

    h3: {
      color: "#2D3246",
      fontWeight: "700"
    },

    h4: {
      fontWeight: "700", 
      color: "#2D3246"
    },

    h5: {
      "@media (min-width: 300px)": {
        fontSize: "1.2rem",
      },

      color: "#2D3246"
    },


    fontFamily: "Plus Jakarta Sans",
    
  },

  palette: {
    primary: {
      main: "#3b4252",
    },

    secondary: {
      main: "#0044ff",
      dark: "#2D3246",
      light: "#CECFD3"
    },
  },
});

const _Layout: React.FC<Props> = ({ children, breakpoint }) => {
  const { mobile, tabPort, tabLand, desktop } = breakpoint;
  const [showAccord, setAccord] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current?.getBoundingClientRect().height as number;

  const value: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = [
    showAccord,
    setAccord,
  ];

  const mNavOpt = ["Compress", "Convert", "Merge", "Edit", "Sign"];
  const NewList = () => {
    return (
      <List
        ref={ref}
        component="div"
        sx={{
          py: 0,
          visibility: showAccord ? "visible" : "hidden",
        }}
      >
        {mNavOpt.map((ele: string, idx) => (
          <ListItem
            button
            key={idx}
            sx={{ borderBottom: "1px solid #797785", py: "1.5rem" }}
          >
            <ListItemText
              primary={`${ele}`}
              disableTypography
              sx={{
                color: "white",
              }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <>
      <Context.Provider value={value}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Box
            sx={{
              height: showAccord ? height : 0,
              bgcolor: "primary.main",
              visibility: showAccord ? "visible" : "hidden",
              transition: "ease-out .4s",
            }}
          >
            <NewList />
          </Box>
          <Container
            disableGutters
            maxWidth="desktop"
            sx={[
              {
                px: 0,
              },

              mobile && {
                px: "1rem",
              },
            ]}
          >
            {children}
          </Container>
          <Footer breakpoint={breakpoint}/>
        </ThemeProvider>
      </Context.Provider>
    </>
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint,
  };
};

export const Layout = connect(mapStateToProps)(_Layout);
