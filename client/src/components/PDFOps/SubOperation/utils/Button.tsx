import React from "react";
import { Button, darken } from "@mui/material";

type FetchFunc<T> = T extends (...args: infer E) => infer U
  ? (...args: E) => U
  : any;

interface BaseProps {
  text: string;
  bg?: string;
  width: string;
  disable?: boolean,
  fontSize?: string
}

type TaskProps<T> = {
  task: FetchFunc<T>;
} & BaseProps;

export const TaskButton: <T>(p: TaskProps<T>) => React.ReactElement = ({
  task,
  bg,
  text,
  width,
  disable,
  fontSize
}) => {
  return (
    <Button
      onClick={task}
      variant="contained"
      disabled= {disable}
      size="large"
      sx={{
        width,
        p: ".4rem 6rem",
        mt: "-2rem",
        backgroundColor: "#0055FF",
        textTransform: "none",
        fontSize: fontSize || "1.2rem",
        fontWeight: "700",

        "&:hover": {
          backgroundColor: darken("#0055FF", 0.2),
        },
      }}
    >
      {text}
    </Button>
  );
};
