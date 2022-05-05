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
  darken
} from "@mui/material";
import Word from "./icons/word.svg";
import Merge from "./icons/merge.png";
import Jpg from "./icons/JPG.png";
import eSign from "./icons/eSign.png";
import Edit from "./icons/edit.png";
import Compress from "./icons/compress.png";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GMQ } from "../reducers";

interface Tool {
  name: string;
  icon: string;
  des: string;
}

interface Props {
  breakpoint: GMQ;
  count: number;
}

const tools: Tool[] = [
  { name: "PDF to Word", icon: Word, des: "Covert PDF into Word files easily" },
  { name: "Merge PDF", icon: Merge, des: "Merge multiple PDF's into one" },
  { name: "JPG to PDF", icon: Jpg, des: "Transform JPG and PNG images to PDF" },
  {
    name: "eSign PDF",
    icon: eSign,
    des: "Create your signature and sign multiple PDF's",
  },
  {
    name: "Edit PDF",
    icon: Edit,
    des: "Add shapes, text and images to your PDF's",
  },
  {
    name: "Compress PDF",
    icon: Compress,
    des: "Reduce the size of your PDF without loosing quality",
  },
];

export default function Tools(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (  
    <>
      {tools.map((t: Tool, idx: number) => {
        if(idx === props.count) return null;
        return (
          <Grid key={t.name} item xs={12} sm={6} md={6} lg={4}>
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
                }
              }}
            >
              <Grid container columnSpacing={2} sx= {{height: "100%"}}>
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
                    sx={[
                      { width: "100%", p: "0" },
                    ]}
                  >
                    <Icon sx={[{ width: "100%", height: "100%" }]}>
                      <img src={t.icon} alt="icon" style={{ width: "100%" }} />
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
                      {t.name}
                    </Typography>
                    <Typography sx={{ fontSize: ".9rem" }}>{t.des}</Typography>
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
          </Grid>
        );
      })}
    </>
  );
}
