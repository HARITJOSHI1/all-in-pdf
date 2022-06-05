import {
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { createTheme, darken, ThemeProvider } from "@mui/material/styles";
import React, { useState, createContext, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { NavBar } from "../Navbar";
import Modal from "../Modal";
import { GMQ, State } from "../reducers";
import Footer from "../Footer";
import EntryForm from "../Entry/EntryForm";
import SignUp from "../Entry/SignUp";
import Login from "../Entry/Login";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "firebase/auth";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { OPERATIONS } from "../PDFOps/Operations";

interface ShowAccord {
  showAccord: boolean;
  setAccord: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShowModal {
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthContextState {
  isErr: { message: string | null };
  setErr: React.Dispatch<
    React.SetStateAction<{
      message: string | null;
    }>
  >;
}

interface ShowLogin {
  showLogin: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

type contextStore = [ShowAccord, ShowModal, AuthContextState, ShowLogin];

export const Context = createContext<contextStore>([
  { showAccord: false, setAccord: () => {} },
  { showModal: false, setModal: () => {} },
  {
    isErr: { message: null },
    setErr: () => {},
  },
  { showLogin: false, setLogin: () => {} },
]);

interface Props extends RouteComponentProps<any> {
  breakpoint: GMQ;
  children?: JSX.Element[] | null;
  user: User;
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

const _Layout: React.FC<Props> = ({ children, breakpoint, user, history }) => {
  const { mobile, tabPort, tabLand, desktop } = breakpoint;
  const [showAccord, setAccord] = useState<boolean>(false);
  const [showModal, setModal] = useState<boolean>(false);
  const [isErr, setErr] = useState<{ message: string | null }>({
    message: null,
  });
  const [showLogin, setLogin] = useState<boolean>(false);

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
      setAccord(false);
    });
    return () => {
      unlisten();
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const height = ref.current?.getBoundingClientRect().height as number;

  const value1: ShowAccord = { showAccord, setAccord };
  const value2: ShowModal = { showModal, setModal };
  const value3: AuthContextState = { isErr, setErr };
  const value4: ShowLogin = { showLogin, setLogin };

  const mNavOpt = ["Compress", "Convert", "Merge", "Edit", "eSign"];
  const links = Object.keys(OPERATIONS);

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
        {mNavOpt.map((ele: string, idx: number, arr: string[]) => {
          if (idx === 5 && user) return null;

          return (
            <Link
              key={idx}
              to={idx <= 4 ? `/operation/${links[idx]}` : `/`}
              style={{ textDecoration: "none" }}
            >
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
                onClick={() => {
                  if (idx === 5) {
                    setModal(true);
                  }
                }}
                sx={{
                  borderBottom: "1px solid #797785",
                  py: "1.5rem",
                  "&:focus, &:click": {
                    bgcolor: darken("#6184b8", 0.2),
                  },
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
            </Link>
          );
        })}

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
          onClick={() => {
            setModal(true);
          }}
          sx={{
            py: "1.5rem",
            background: "#6184b8",

            "&:hover": {
              bgcolor: darken("#6184b8", 0.2),
            },

            "&:focus, &:click": {
              bgcolor: darken("#6184b8", 0.2),
            },
          }}
        >
          <ListItemText
            primary="Sign Up"
            disableTypography
            sx={{
              color: "white",
            }}
          />
        </ListItem>
      </List>
    );
  };

  return (
    <>
      <Context.Provider value={[value1, value2, value3, value4]}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <AnimatePresence>
            {showModal && (
              <Modal on={showModal} key="modal" breakpoint={breakpoint}>
                {!showLogin ? (
                  <SignUp breakpoint={breakpoint}>
                    <EntryForm
                      breakpoint={breakpoint}
                      setModal={setModal}
                      num={3}
                    />
                  </SignUp>
                ) : (
                  <Login breakpoint={breakpoint}>
                    <EntryForm
                      breakpoint={breakpoint}
                      setModal={setModal}
                      num={2}
                    />
                  </Login>
                )}
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
    breakpoint: state.breakpoint as GMQ,
    user: state.user as User,
  };
};

export const Layout = connect(mapStateToProps)(withRouter(_Layout));
