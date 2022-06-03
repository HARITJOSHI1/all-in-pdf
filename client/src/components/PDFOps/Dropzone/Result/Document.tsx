import { Box, Grid, Icon, Stack, Typography } from "@mui/material";
import React from "react";
import { GMQ } from "../../../reducers";
import { useFileData } from "../hook/useFileData";
import { VscFilePdf } from "react-icons/vsc";

interface Props {
  breakpoint: GMQ;
}

export default function Document(props: Props) {
  // const data = useFileData();
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      lg={4}
      sx={[
        { width: "100%", border: "1px solid white", borderRadius: "5px", py: "2rem" },
        (mobile || tabPort) && { width: "100%", mb: "4rem" },
      ]}
    >
      <Stack
        direction="column"
        justifyContent="center"
        spacing= {1}
        alignItems="center"
        sx={{ width: "100%", height: "100%"}}
      >
        <Icon sx={{ width: "4rem", height: "4rem" }}>
          <VscFilePdf style={{ width: "100%", height: "100%" }} color= "white"/>
        </Icon>

        <Stack direction="column" alignItems="center">
          <Typography
            component="span"
            sx={{ color: "white", fontSize: "1.5rem", fontWeight: "100" }}
          >
            Some.pdf
          </Typography>

          <Typography
            component="span"
            sx={{ color: "white", fontSize: "1.5rem", fontWeight: "200" }}
          >
            900 KB
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );
}
