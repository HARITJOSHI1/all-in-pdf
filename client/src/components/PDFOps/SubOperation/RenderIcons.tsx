import React from "react";
import { Stack, Icon, Typography, Grid } from "@mui/material";
import { DataFromDropzone } from ".";
import { GMQ } from "../../reducers";
import pdf from "./icons/pdf.png";

interface Props {
  breakpoints: GMQ;
  state: DataFromDropzone;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const RenderDocIcons: React.FC<Props> = (props) => {
  const { state, breakpoints, setSelectedFile } = props;
  const { mobile, tabLand, tabPort, desktop } = breakpoints;

  return (
    <Stack
      direction={mobile ? "column" : "row"}
      justifyContent="center"
      alignItems={mobile || tabPort ? "center" : "flex-start"}
      flexWrap={mobile ? "nowrap" : "wrap"}
      spacing={2}
      sx={{ width: "100%", p: "0 !important" }}
    >
      {state?.allFiles.map((file, idx) => {
        if (file) {
          return (
            <Grid
              item
              key={idx}
              xs={12}
              sm={2}
              md={3}
              lg={2}
              sx={{ mb: "2rem !important" }}
            >
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                <Icon
                  sx={{ width: "4rem", height: "4rem", cursor: "pointer" }}
                  onClick={() => setSelectedFile(file)}
                >
                  <img src={pdf} alt="pdf" width="100%" height="100%" />
                </Icon>
                <Typography
                  component="span"
                  sx={[
                    {
                      display: "inline-block",
                      fontSize: "1rem",
                      cursor: "pointer",
                      textAlign: "center",
                      width: "50%",
                      overflowWrap: "break-word",
                    },

                    (mobile || tabPort) && { width: "100%" },
                  ]}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </Typography>
              </Stack>
            </Grid>
          );
        }

        return null;
      })}
    </Stack>
  );
};
