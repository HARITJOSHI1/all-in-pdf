import React from "react";
import { Button } from "@mui/material";
import { SxProps } from "@mui/material/styles";

interface Props {
  text: string;
  sx: SxProps;
}

const Btn: React.FC<Props> = function Btn({ sx, text }) {
  return (
    <Button
      size="medium"
      sx={[
          {whiteSpace: 'nowrap'},
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {text}
    </Button>
  );
};

export default Btn;
