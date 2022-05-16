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
import Modal from "../Modal";
import { GMQ, State } from "../reducers";
import Footer from "../Footer";
import SignUp from "../Entry/SignUp";
import { motion, AnimatePresence } from "framer-motion";

interface ShowAccord {
  showAccord: boolean;
  setAccord: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShowModal {
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type contextStore = [ShowAccord, ShowModal];

export const Context = createContext<contextStore>([
  { showAccord: false, setAccord: () => {} },
  { showModal: false, setModal: () => {} },
]);

interface Props {
  breakpoint: GMQ;
  children?: JSX.Element[] | null;
}

const theme = createTheme({
  typography: {
    h1: {
      color: "#2D3246",
    },

    h2: {
      color: "#2D3246",
      fontWeight: "700",
    },

    h3: {
      color: "#2D3246",
      fontWeight: "700",
    },

    h4: {
      fontWeight: "700",
      color: "#2D3246",
    },

    h5: {
      "@media (min-width: 300px)": {
        fontSize: "1.2rem",
      },

      color: "#2D3246",
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
      light: "#CECFD3",
    },
  },
});

const _Layout: React.FC<Props> = ({ children, breakpoint }) => {
  const { mobile, tabPort, tabLand, desktop } = breakpoint;
  const [showAccord, setAccord] = useState<boolean>(false);
  const [showModal, setModal] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current?.getBoundingClientRect().height as number;

  const value1: ShowAccord = { showAccord, setAccord };
  const value2: ShowModal = { showModal, setModal };

  const mNavOpt = ["Compress", "Convert", "Merge", "Edit", "eSign", "Sign Up"];

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
        {mNavOpt.map((ele: string, idx: number, arr: string[]) => (
          <ListItem
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              ease: "easeIn",
              duration: 0.4,
            }}
            exit={{ opacity: 0 }}
            button
            key={idx}
            sx={{
              // opacity: showAccord ? 1 : 0,
              // transition: "ease-in 0.3s",
              borderBottom: "1px solid #797785",
              py: "1.5rem",
              bgcolor: idx === arr.length - 1 ? "#6184b8" : "",
            }}
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
      <Context.Provider value={[value1, value2]}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AnimatePresence>
            {showModal && (
              <Modal key="modal" breakpoint={breakpoint}>
                <SignUp breakpoint={breakpoint} />
              </Modal>
            )}
          </AnimatePresence>

          <NavBar />

          <Box
            component={motion.div}
            initial={{ height: 0 }}
            animate={{ height: showAccord ? height : 0 }}
            transition={{
              ease: "easeIn",
              duration: 0.4,
            }}
            sx={{
              bgcolor: "primary.main",
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
          <Footer breakpoint={breakpoint} />
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
