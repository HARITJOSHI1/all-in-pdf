import { Stack, Grid } from "@mui/material";
import Document from "./Document";
import React from "react";
import SaveAndShare from "./SaveAndShare";
import { GMQ } from "../../../reducers";

interface Props {
  breakpoint: GMQ;
}

export default function Result(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={[{
          py: "4rem",
          display: "flex",
          flexDirection: (tabPort || mobile) ? "column": "row",
          justifyContent: tabLand ? "space-between" : "space-around",
        }, tabLand && {p: "2rem 4rem"}, tabPort && {p: "2rem", height: "100vh"}, mobile && {p: "1rem", height: "80vh"}]}
      >
        <Document breakpoint={props.breakpoint}/>
        <SaveAndShare breakpoint={props.breakpoint} />
        
      </Grid>
    </>
  );
}
