import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { GMQ } from "../reducers";
import { Link } from "react-router-dom";
import Features from "./features";

interface Props {
  breakpoint: GMQ;
}

export default function Section4(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <section>
      <Stack
        direction="column"
        alignItems="center"
        sx={[
          {
            px: "6rem",
            pt: "12rem",
          },

          tabPort && {
            pt: "5rem",
          },

          mobile && {
            px: "0",
            pt: "6rem",
          },
        ]}
      >
        <Grid container spacing={(desktop ? 15 : 8)}>
          <Features breakpoint= {props.breakpoint}/>
        </Grid>
      </Stack>
    </section>
  );
}
