import React from "react";
import AppBar from "@mui/material/AppBar";
import { Stack } from "@mui/material";
import { darken } from "@material-ui/core/styles/colorManipulator";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuBtn from "../Buttons/Menu";
import Logo from "../Logo";
import EditBtn from "../Buttons/Button";
import Container from "@mui/material/Container";
import DropDown from "../Icons/dropDown";
import { connect } from "react-redux";
import { GMQ, State } from "../reducers";
import Translator from "../Translator";


const navOpts = ["Compress", "Convert", "Merge", "Edit", "Sign"];

interface Props {
  breakpoint: GMQ;
}

const _NavBar: React.FC<Props> = ({ breakpoint }) => {
  const { mobile, tabPort, tabLand, desktop } = breakpoint;
  
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          boxShadow: 7,
        }}
      >
        <Container maxWidth="desktop">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
              <Box
                sx={[
                  { display: "flex", alignItems: "center", ml: "6rem" },
                  (mobile || tabPort) && {
                    width: "100%",
                    ml: "1rem",
                  },
                ]}
              >
                <Logo />

                {(mobile || tabPort || tabLand) && <DropDown tabLand = {tabLand}/>}

                {(tabLand || desktop) && (
                  <MenuBtn
                    breakpoint={[mobile, tabLand, desktop]}
                    navOpts={navOpts}
                  />
                )}
              </Box>

              <Stack
                direction="row"
                spacing={5}
                sx={[{ mr: "3rem" }, mobile && { mr: "1rem" }, tabPort && {mr: "1rem"}]}
              >
                <Translator />

                {!mobile && (
                  <EditBtn
                    text="Edit Pdf"
                    sx={[
                      {
                        backgroundColor: "#0055FF",
                        text: "Edit",
                        color: "white",
                        fontSize: "1rem",
                        fontWeight: "800",
                        letterSpacing: "1px",
                        px: "1.5rem",
                        textTransform: "none",
                      },

                      {
                        "&:hover": {
                          bgcolor: darken("#0055FF", 0.2),
                        },
                      },
                    ]}
                  />
                )}
              </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint,
  };
};

export const NavBar = connect(mapStateToProps)(_NavBar);
