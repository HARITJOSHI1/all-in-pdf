import React from "react";
import { Stack, Button } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { Link } from "react-router-dom";
import {OpKeys} from "../PDFOps/Operations";

interface Props {
  breakpoint: boolean[];
  navOpts: { name: string; link: OpKeys}[];
}

const MenuBtn: React.FC<Props> = ({ breakpoint, navOpts }) => {
  const [mobile, tabLand, desktop] = breakpoint;

  return (
    <Stack
      direction="row"
      spacing={4}
      alignItems="center"
      sx={[
        (tabLand || desktop) && {
          mx: "2rem",
        },
      ]}
    >
      <Button
        aria-label="tools"
        size="medium"
        sx={{ textTransform: "none" }}
        startIcon={
          <WidgetsOutlinedIcon
            sx={{
              fontWeight: "200",
              fontSize: "1.2rem",
              color: "black",
            }}
          />
        }
      >
        Tools
      </Button>

      <Stack
        spacing={5}
        direction="row"
        sx={[
          mobile && {
            display: "none",
          },
        ]}
      >
        {navOpts.map((opt, idx: number) => {
          return (
            <Link key={idx} to={`/operation/${opt.link}`} style={{ textDecoration: "none" }}>
              <Button
                disableRipple
                size="small"
                sx={[
                  {
                    "&:hover": {
                      color: "#8d8599",
                      backgroundColor: "white",
                    },
                  },

                  { textTransform: "none", px: "0", minWidth: "0" },
                ]}
              >
                {opt.name}
              </Button>
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default MenuBtn;
