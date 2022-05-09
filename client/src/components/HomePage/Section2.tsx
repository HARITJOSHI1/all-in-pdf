import React from "react";
import {
  Button,
  Container,
  darken,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { GMQ } from "../reducers";
import Tools from "../tools/Tools";

interface Props {
  breakpoint: GMQ;
}

export default function Section2(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  
  return (
    <section
      style={{ borderBottom: "1px solid #CECFD3", paddingBottom: "2rem" }}
    >
      <Stack sx={{ pt: "5rem" }}>
        <Grid alignItems="center" justifyContent="center" container spacing={3}>
          <Grid item xs={12} sm={8} md={6} lg={7}>
            <Stack
              direction="column"
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h2"
                sx={[{
                  fontSize: "3rem",
                }, mobile && {fontSize: "2.5rem"}]}
              >
                Popular tools
              </Typography>

              <Typography
                component="span"
                sx={{px: "1rem" }}
              >
                21 tools to convert, compress, and edit PDFs for free. Try it
                out today!
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={10} md={9} lg={7}>
            <Grid container spacing={4}>
              <Tools breakpoint={props.breakpoint} count={6} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={10} md={9} lg={7}>
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0055FF",
                  textTransform: "none",
                  p: ".5rem 2rem",
                  "&:hover": {
                    bgcolor: darken("#0055FF", 0.2),
                  },
                }}
              >
                <Typography style={{ fontWeight: "700" }}>See more </Typography>
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </section>
  );
}
