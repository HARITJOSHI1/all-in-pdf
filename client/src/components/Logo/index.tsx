import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  color?: string;
}

export default function Logo(props: Props) {
  return (
    <Link to="/" style = {{textDecoration: "none"}}>
      <Typography
        variant="h5"
        noWrap
        component="span"
        sx={{
          fontWeight: "800",
          letterSpacing: ".5px",
          color: props.color ? props.color : "primary.main",
        }}
      >
        Superpdf
      </Typography>
    </Link>
  );
}
