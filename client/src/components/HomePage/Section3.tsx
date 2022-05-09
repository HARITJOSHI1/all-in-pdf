import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { GMQ } from "../reducers";

interface Props {
  breakpoint: GMQ;
}

export default function Section3(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  return (
    <section style={{ paddingTop: "5rem" }}>
      <Box>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Typography
            component="span"
            variant="h2"
            sx={[
              {
                fontSize: "3rem",
                textAlign: "center",
              },
              mobile && { fontSize: "2.5rem" },
            ]}
          >
            Simplify heavy PDF work
          </Typography>

          <Typography
            component="span"
            sx={[
              {
                color: "secondary.dark",
                textAlign: mobile ? "center" : "justify",
                width: "37%",
              },

              (tabPort || tabLand) && {
                width: "75%",
              },

              mobile && {
                width: "100%",
              },
            ]}
          >
            Superpdf is a PDF software you’ll love. We have all the tools you’ll
            need to start, manage, and finish your work with digital documents.
          </Typography>
        </Stack>
      </Box>
    </section>
  );
}
