import React, { useContext } from "react";
import {
  Box,
  FormControlLabel,
  Icon,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import pdf from "./icons/pdf.png";
import { GMQ } from "../../reducers";
import { TaskButton } from "./utils/Button";
import { Context } from "../../Layout";

interface Props {
  numFiles: number;
  breakpoints: GMQ;
}

export const OrientationSelector = (props: Props) => {
  const [selectedValue, setSelectedValue] = React.useState("left");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const { setModal } = useContext(Context)[1];

  const closeModal = () => {
    setModal({ show: false, fn: () => null });
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{
        width: "40%",
        bgcolor: "white",
        p: "2rem",
        borderRadius: "4px",
        position: "relative",
        zIndex: "100000",
      }}
    >
      <Box component="header">
        <Typography variant="h4" sx={{ fontSize: "2rem" }}>
          Select the rotation type
        </Typography>
      </Box>

      <Box>
        <Icon sx={{ width: "4rem", height: "4rem"}}>
          <img src={pdf} alt="pdf" width="100%" height="100%" />
        </Icon>
      </Box>

      <Box sx={{ mt: "-0.02rem !important" }}>
        <span>{`Apply operation on ${props.numFiles} ${
          props.numFiles > 1 ? "files" : "file"
        }`}</span>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ width: "55%" }}
      >
        <FormControlLabel
          value="end"
          control={
            <Radio
              {...controlProps("left")}
              sx={{
                color: "#BD7BD5",
                "&.Mui-checked": {
                  color: "#BD7BD5",
                },

                "& .MuiSvgIcon-root": {
                  fontSize: 48,
                },
              }}
            />
          }
          label="Left"
          labelPlacement="end"
        />

        <FormControlLabel
          value="end"
          control={
            <Radio
              {...controlProps("right")}
              sx={{
                color: "#BD7BD5",
                "&.Mui-checked": {
                  color: "#BD7BD5",
                },

                "& .MuiSvgIcon-root": {
                  fontSize: 48,
                },
              }}
            />
          }
          label="Right"
          labelPlacement="end"
        />
      </Stack>

      <TaskButton<typeof closeModal>
        task={closeModal}
        width="100%"
        text="Apply settings"
        fontSize="1.05rem"
      />
    </Stack>
  );
};
