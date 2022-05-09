import {
  Box,
  Grid,
  Icon,
  Stack,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import React from "react";
import { GMQ } from "../reducers";
import WCU from "./assets/wcu.png";
import wcuBlob from "./assets/wcu-blob.svg";
import dots from "./assets/dots.svg";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface Reason {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  head: string;
  des: string;
}

const reasons: Reason[] = [
  {
    icon: FlashOnIcon,
    head: "Fast at service",
    des: `Our solution solves your PDF problems quickly by making use of the trusted services with highest becnchmarks.`,
  },

  {
    icon: EnhancedEncryptionIcon,
    head: "Encrypted",
    des: `All your documents and data is encrypted with superpdf so that you can work without thinking about any loss.`,
  },

  {
    icon: SendAndArchiveIcon,
    head: "Share your work",
    des: `With superpdf you can share your pdf's via email and whatsapp plus download it for free.`,
  },
];

const GenerateReasons: React.FC<Props> = (props: Props) => {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  return (
    <>
      {reasons.map((r: Reason, idx: number) => {
        return (
          <Grid
            key={idx}
            container
            sx={{ position: "relative", zIndex: "1000", width: "95%" }}
          >
            <Grid item xs={2} sm={2} lg={2}>
              <Icon
                sx={[
                  {
                    display: "inline-block",
                    width: "90%",
                    height: "100%",
                  },
                  mobile && { width: "90%" },
                ]}
              >
                <svg width={0} height={0}>
                  <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
                    <stop stopColor="rgba(123,217,247,1)" offset="7%" />
                    <stop stopColor="rgba(14,114,227,1)" offset="65%" />
                    <stop stopColor="rgba(64,212,203,1)" offset="77%" />
                  </linearGradient>
                </svg>
                <r.icon
                  sx={{
                    width: "100%",
                    fill: "url(#linearColors)",
                    height: "auto",
                  }}
                />
              </Icon>
            </Grid>

            <Grid item xs={10} sm={10} lg={10}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="h4"
                  sx={[
                    { width: "max-content" },
                    tabPort && { fontSize: "1.7rem" },
                  ]}
                >
                  {r.head}
                </Typography>
                <Typography
                  component="span"
                  sx={[
                    { fontWeight: "500", width: "85%" },
                    tabPort && { fontSize: "1rem" },
                  ]}
                >
                  {r.des}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

interface Props {
  breakpoint: GMQ;
}

export default function Section5(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

  return (
    <section>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ pt: "6rem" }}
        spacing={mobile ? 1 : 10}
      >
        <Typography variant="h2" sx={[mobile && { fontSize: "2.5rem" }]}>
          Why Choose Us ?
        </Typography>

        <Grid container sx={{ overflow: "hidden" }}>
          <Stack direction={mobile ? "column" : "row"}>
            <Grid
              item
              xs={12}
              md={7}
              lg={8}
              sx={{ display: "flex" }}
              justifyContent="center"
            >
              <Box>
                <img
                  src={WCU}
                  alt="some"
                  style={{
                    width: "100%",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              lg={5}
              sx={{
                display: "flex",
                ml: desktop ? "-8rem" : "0",
                pl: desktop ? "2.5rem" : "0",
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                spacing={4}
                direction="column"
                sx={[mobile && { alignItems: "center", mt: "2rem" }]}
              >
                <GenerateReasons breakpoint={props.breakpoint} />
              </Stack>
            </Grid>

            {desktop && (
              <>
                {" "}
                <Grid
                  item
                  lg={3}
                  sx={{
                    ml: "-10rem",
                    mr: "-8rem",
                    mt: "-8rem",
                    position: "relative",
                    zIndex: "1000",
                  }}
                >
                  <Box>
                    <img
                      src={dots}
                      alt="some"
                      style={{ width: "40rem", opacity: ".6", pointerEvents: "none",
                      userSelect: "none", }}
                    />
                  </Box>
                </Grid>
                <Grid item lg={3} sx={{ ml: "-14rem", mr: "8rem" }}>
                  <Box>
                    <img
                      src={wcuBlob}
                      alt="some"
                      style={{ width: "50rem", opacity: ".84", pointerEvents: "none",
                      userSelect: "none", }}
                    />
                  </Box>
                </Grid>
              </>
            )}
          </Stack>
        </Grid>
      </Stack>
    </section>
  );
}
