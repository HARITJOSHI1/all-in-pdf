import { Box } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import Jumbotron from "../Jumbotron";
import { GMQ, State } from "../reducers";
import HomeIcon from "./assets/HomeIcon2.svg";
import HomeBlob from "./HomeBlob.svg";
import { Stack } from "@mui/material";

interface Props {
  breakpoint: GMQ;
}

const _Home: React.FC<Props> = ({ breakpoint }) => {
  const { mobile, tabPort, tabLand, desktop } = breakpoint;
  return (
    <section>
      <Stack
        spacing={10}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          pt: !mobile ? "7rem" : "4rem",
        }}
      >
        <Jumbotron breakpoint={{ mobile, tabPort, tabLand, desktop }} />

        <Stack
          sx={[{ width: "50%", height: "20%" }, mobile && { width: "100%" }]}
        >
          <img
            src={HomeIcon}
            alt="Home icon"
            style={{ pointerEvents: "none", userSelect: "none" }}
          />
        </Stack>
      </Stack>
    </section>
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint,
  };
};

export default connect(mapStateToProps)(_Home);
