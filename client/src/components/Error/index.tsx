import { Box, Typography } from "@mui/material";
import React from "react";
import { GMQ } from "../reducers";

interface Props {
  err: string;
  breakpoint: GMQ;
}

export default function Error(props: Props) {
  const { tabLand, desktop } = props.breakpoint;
  return (
    <Box
      sx={{
        border: "1px solid #fa666e",
        borderRadius: "5px",
        bgcolor: "#5c0f13",
        position: "relative",
        bottom: desktop || tabLand ? ".85rem" : "0",
        p: ".5rem",
        width: "100%"
      }}
    >
      <Typography variant="h5" sx={{ color: "#fa666e" , fontSize: "1rem !important", fontWeight: 500}}>
        {props.err}
      </Typography>
    </Box>
  );
}
