import React, { useContext } from "react";
import { Button } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import { Context } from "../Layout";

interface Props {
  text: string;
  sx: SxProps;
}

const Btn: React.FC<Props> = function Btn({ sx, text }) {
  const { showModal, setModal } = useContext(Context)[1];
  return (
    <Button
      size="medium"
      sx={[{ whiteSpace: "nowrap" }, ...(Array.isArray(sx) ? sx : [sx])]}
      onClick={() => { 
        setModal(true);
      }}
    >
      {text}
    </Button>
  );
};

export default Btn;
