import React from "react";
import {
  Stack,
  Box,
  Grid,
  Typography,
  Button,
  darken,
  Icon,
} from "@mui/material";
import { GMQ } from "../reducers";
import Trial from "./assets/trial.png";

interface Props {
  breakpoint: GMQ;
}

export default function Section6(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <section>
      <Stack
        direction="column"
        sx={{ pt: !desktop ? "5rem" : "0", px: tabPort ? "1rem" : "0" }}
        alignItems="center"
      >
        <Box
          sx={[
            {
              p: `4rem ${mobile ? "2rem" : "4rem"}`,
              backgroundColor: "#F4F4F4",
              borderRadius: "3px",
              width: desktop ? "70%" : "100%",
            },
            tabLand && { width: "80%" },
          ]}
        >
          <Grid container>
            <Grid item xs={12} md={7} lg={6}>
              <Stack
                direction="column"
                spacing={2}
                alignItems={!desktop && !tabLand ? "center" : ""}
              >
                <Typography
                  variant="h3"
                  sx={[
                    { fontSize: "3rem" },
                    mobile && { fontSize: "2.5rem", textAlign: "center" },
                  ]}
                >
                  Give us a shot
                </Typography>

                <Typography
                  component="span"
                  sx={{
                    color: "secondary.dark",
                    textAlign: mobile ? "center" : "",
                    width: tabPort ? "80%" : "100%",
                  }}
                >
                  Start your 7-day free trial and get unlimited access to all
                  superpdf tools to convert, compress, e-sign, and more.
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    position: "relative",
                    bottom: "-1rem",
                    bgcolor: "#0055FF",
                    textTransform: "none",
                    width: "50%",
                    p: ".5rem 2rem",
                    "&:hover": {
                      bgcolor: darken("#0055FF", 0.2),
                    },
                  }}
                >
                  <Typography style={{ fontWeight: "700" }}>
                    Start Free Trial
                  </Typography>
                </Button>
              </Stack>
            </Grid>
            {(desktop || tabLand) && (
              <Grid
                item
                xs={12}
                md={5}
                lg={6}
                justifyContent="center"
                sx={{ display: "flex" }}
              >
                <Icon sx={{ width: desktop? "70%" : "90%", height: "auto" }}>
                  <img
                    src={Trial}
                    alt="trial"
                    style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                  />
                </Icon>
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>
    </section>
  );
}
