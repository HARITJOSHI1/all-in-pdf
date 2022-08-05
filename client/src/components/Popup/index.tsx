import { Box, Typography } from "@mui/material";
import React from "react";
import { GMQ } from "../reducers";

interface Props {
  err: string;
  breakpoint: GMQ;
  status?: boolean;
}

export default function Popup(props: Props) {
  const { tabLand, desktop, mobile, tabPort } = props.breakpoint;
  return (
    <Box
      sx={{
        border: `1px solid ${props.status ? '#5fc7a3' : '#fa666e'}`,
        borderRadius: '5px',
        bgcolor: props.status ? '#25473b' : '#5c0f13',
        position: 'relative',
        bottom: desktop || tabLand ? '.85rem' : '0',
        p: '.5rem',
        mb: mobile || tabPort ? '1.5rem' : '',
        mt: desktop || tabLand ? '1rem' : '',
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: props.status ? '#5fc7a3' : '#fa666e',
          fontSize: '1rem !important',
          fontWeight: 500,
        }}
      >
        {props.err}
      </Typography>
    </Box>
  );
}
