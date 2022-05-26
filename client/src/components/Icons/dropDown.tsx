import React, { SetStateAction, useContext, useEffect } from "react";
import { IconButton } from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { Context } from "../Layout";

export default function DropDown(props: { tabLand: boolean }) {
  const {showAccord, setAccord} = useContext(Context)[0];

  useEffect(() => {
    if (props.tabLand) setAccord(false);
  }, [props.tabLand, setAccord]);

  const openDropDown = () => setAccord(!showAccord);

  return (
    <IconButton
      onClick={openDropDown}
      aria-label="drop-menu"
      sx={{ ml: "auto", mr: "1rem" }}
    >
      <KeyboardArrowDownOutlinedIcon
        sx={[
          {
            fontWeight: "500",
            fontSize: "1.5rem",
            color: "black",
            transition: ".2s"
          },

          showAccord && {
            transform: "rotate(180deg)",
          },
        ]}
      />
    </IconButton>
  );
}
