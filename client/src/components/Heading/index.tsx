import { SxProps, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface Props {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit"
    | undefined;
  sx: SxProps;
  children?: string | ReactNode; 
}

export default function Heading(props: Props) {
  const { variant, sx, children } = props;
  return <Typography variant={variant} sx= {{...sx}}>{children}</Typography>;
}
