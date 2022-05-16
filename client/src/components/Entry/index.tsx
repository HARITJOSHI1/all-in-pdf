import React, { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { alpha, Box, darken, Icon, Stack } from "@mui/material";
import { GMQ } from "../reducers";
import EntryInfo from "./EntryInfo";
import { motion } from "framer-motion";
import OAuth from "../Auth";

interface Props {
  breakpoint: GMQ;
  children?: ReactNode;
  img?: string;
}

export default function index(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <Card
      key="card"
      component={motion.div}
      initial={{ scale: 0 }}
      transition={{
        ease: "easeIn",
        duration: 0.255,
      }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      sx={[
        {
          bgcolor: "white",
          height: "100%",
          width: mobile ? "90%" : "auto",
          opacity: "1",
          position: "relative",
          zIndex: "100000",
          borderRadius: "12px",
        },

        tabPort && {
          width: "60%",
          height: "auto",
        },
      ]}
    >
      <Stack
        direction="column"
        alignItems="center"
        sx={[
          { height: "100%", maxHeight: "100%" },
          (tabLand || desktop) && {
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          },
        ]}
      >
        {(desktop || tabLand) && <EntryInfo />}

        <CardContent
          sx={[
            {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "start",
              height: "100%",
              p: "2.5rem",
              pb: "2.5rem !important",
              width: "60%",

              "& > :not(:last-child)": {
                marginBottom: "1.5rem",
              },
            },
            (tabPort || mobile) && { height: "100%", px: "2", width: "auto" },
          ]}
        >
          <Typography
            variant="h4"
            component="div"
            sx={[
              { fontSize: "1.8rem" },
              tabPort && { fontSize: "1.5rem" },
              mobile && { fontSize: "1.5rem" },
            ]}
          >
            Sign Up
          </Typography>

          <OAuth breakpoint={props.breakpoint} />

          {props.children}

          <CardActions sx={{ width: "100%", p: "0" }}>
            <Button
              variant="contained"
              sx={{
                position: "relative",
                bgcolor: "#5340FF",
                boxShadow: "none",
                borderRadius: "10px",
                textTransform: "none",
                width: "100%",
                p: ".8rem 4rem",
                "&:hover": {
                  bgcolor: darken("#5340FF", 0.2),
                },
              }}
            >
              <Typography
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                Submit
              </Typography>
            </Button>
          </CardActions>

          <Typography variant="h6" sx={{ color: "#B7B9C1", fontSize: "1rem", fontWeight: "500" }}>
            Already have an account?{" "}
            <span style={{ color: "#5340FF", cursor: "pointer" }}>login</span>
          </Typography>

        </CardContent>
      </Stack>
    </Card>
  );
}
