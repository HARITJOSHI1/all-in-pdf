import { Box } from "@mui/material";
import React, {useRef } from "react";

interface Props {
  text: string;
}

const formatText = (text: string, ref: React.RefObject<HTMLDivElement>) => {
  const newString = text.replace(/\n/g, "<br>");
  const div = document.createElement("div");
  div.innerHTML = newString;
  ref.current?.appendChild(div);
  return null;
};

export const Output = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);  
  return <Box ref= {ref} sx = {{bgcolor: "#F2EFE4", borderRadius: "5px"}}>{formatText(props.text, ref)}</Box>;
};
