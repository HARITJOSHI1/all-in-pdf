import React from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import { IconButton } from "@mui/material";

export default function Translator() {
  return (
    <IconButton
      aria-label="translate"
      sx={[
        { px: "0", py: "0", color: "primary.main" },
        {
          "&:hover": {
            color: "#8d8599",
            background: "none",
            transition: '.4s'
          },
        },
      ]}
    >
      <TranslateIcon />
    </IconButton>
  );
}
