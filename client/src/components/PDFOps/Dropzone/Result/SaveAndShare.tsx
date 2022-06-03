import { Stack, Grid } from "@mui/material";
import React from "react";
import { GMQ } from "../../../reducers";
import PDFBtn from "../PDFBtn";
import { BsDownload } from "react-icons/bs";
import { BsShare } from "react-icons/bs";

interface Props {
  breakpoint: GMQ;
}

export default function SaveAndShare(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  const fn = () => Promise.resolve(console.log("Clicked"));

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={5}
      lg={4}
      sx={{
        border: "1px solid white",
        borderRadius: "5px",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={[
          { width: "100%", height: "100%" },
          (mobile || tabLand) && {
            flexDirection: "column",
          },
          tabPort && { justifyContent: "space-around" },
        ]}
      >
        <PDFBtn
          text="Download"
          fn={fn}
          isConn={false}
          sx={[
            { width: "40%" },
            (mobile || tabLand) && { width: "80%" },
            tabPort && { width: "40%" }
          ]}
          IconForBtn={BsDownload}
        />

        <PDFBtn
          text="Share"
          fn={fn}
          isConn={false}
          sx={[
            { width: "40%" },
            (mobile || tabLand) && { width: "80%" },
            tabPort && { width: "40%" },
          ]}
          IconForBtn={BsShare}
        />
      </Stack>
    </Grid>
  );
}
