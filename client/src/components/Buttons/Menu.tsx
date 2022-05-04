import React from "react";
import { Stack, Button } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { Link } from "react-router-dom";

interface Props {
  breakpoint: boolean[];
  navOpts: string[];
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
        {navOpts.map((opt: string, idx: number) => {
          return (
            <Link key={idx} to = "/tools" style={{textDecoration: "none"}}>
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
                {opt}
              </Button>
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default MenuBtn;
