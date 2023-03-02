/* eslint-disable array-callback-return */
import React from "react";
import {
  Box,
  Container,
  Grid,
  Icon,
  IconButton,
  Stack,
  Typography,
  alpha,
  darken,
} from "@mui/material";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GMQ } from "../reducers";
import { OPERATIONS, OpKeys } from "../PDFOps/Operations";
import { Link } from "react-router-dom";

interface Tool {
  name: string;
  icon: string;
  des: string;
}

interface Props {
  breakpoint: GMQ;
  count: number;
}

export default function Tools(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <>
      {Object.keys(OPERATIONS).map((t: OpKeys | string, idx: number) => {
        if (idx > props.count - 1) return null;
        else{
          const key = t as OpKeys;
          const obj = OPERATIONS[key];

          return (
            <Grid key={obj.name} item xs={12} sm={6} md={6} lg={4}>
              <Link to={`operation/${key}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Box
                  sx={{
                    p: "1rem",
                    pt: "1rem",
                    height: "9rem",
                    backgroundColor: alpha("#CECFD3", 0.3),
                    borderRadius: "3px",
                    cursor: "pointer",
                    transition: ".2s",

                    "&:hover": {
                      backgroundColor: alpha("#CECFD3", 0.7),
                    },
                  }}
                >
                  <Grid container columnSpacing={2} sx={{ height: "100%" }}>
                    <Grid
                      item
                      xs={mobile ? 2 : 3}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <IconButton
                        disableRipple
                        sx={[{ width: "100%", p: "0" }]}
                      >
                        <Icon sx={[{ width: "100%", height: "100%" }]}>
                          <img
                            src={obj.icon}
                            alt="icon"
                            style={{ width: "100%" }}
                          />
                        </Icon>
                      </IconButton>
                    </Grid>

                    <Grid item xs={7}>
                      <Stack spacing={1}>
                        <Typography
                          component="span"
                          sx={{
                            width: "max-content",
                            fontSize: ".9rem",
                            fontWeight: "700",
                          }}
                        >
                          {" "}
                          {obj.name}
                        </Typography>
                        <Typography sx={{ fontSize: ".9rem" }}>
                          {obj.des}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={2} sx={{ textAlign: "right" }}>
                      <IconButton disableRipple>
                        <Icon>
                          <KeyboardArrowRightIcon />
                        </Icon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </Link>
            </Grid>
          );
        }
      })}
    </>
  );
}
