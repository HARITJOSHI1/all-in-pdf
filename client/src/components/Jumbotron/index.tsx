import React from "react";
import { Stack, Typography } from "@mui/material";
import { GMQ } from "../reducers";

interface Props {
  breakpoint: GMQ;
}

export default function Jumbotron(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <Stack
      direction="column"
      spacing={3}
      component="div"
      sx={{position: "relative", zIndex: 1000 }}
    >
      <Typography
        variant="h1"
        component="span"
        sx={[
          {
            fontSize: "7rem",
            whiteSpace: "pre-wrap",
            fontWeight: "900",
            display: "inline-block",
            background:
              "linear-gradient(90deg, rgba(215,59,59,1) 5%, rgba(213,57,201,1) 39%, rgba(0,140,251,1) 86%)",
            color: "transparent",
            backgroundClip: "text",
          },

          mobile && {
            fontSize: "3rem",
          },

          tabPort && {
            fontSize: "4rem",
          },

          tabLand && {
            fontSize: "5rem",
          },
        ]}
      >
        All in one PDF tool
      </Typography>

      <Typography
        component="span"
        variant="h3"
        sx={[
          {
            textAlign: "center",
            fontSize: "3rem",
            fontWeight: "300",
            color: "primary.main"
          },

          mobile && {
            fontSize: "1.5rem"
          },

          tabPort && {
            fontSize: "2rem"
          }
        ]}
      >
        {" "}
        Simple Fast & Secure
      </Typography>
    </Stack>
  );
}
