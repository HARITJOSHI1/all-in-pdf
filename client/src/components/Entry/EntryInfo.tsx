import { Stack, Icon, Typography, Box } from "@mui/material";
import TopicIcon from "@mui/icons-material/Topic";
import RestoreIcon from "@mui/icons-material/Restore";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

const EntryInfo = () => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={5}
      sx={{
        width: "40%",
        height: "100%",
        px: "4rem",
        bgcolor: "#5340FF",
        alignSelf: "start",
      }}
    >
      <Stack direction="column" spacing={2}>
        <Icon sx={{ width: "3rem", height: "3rem", color: "white" }}>
          <TopicIcon sx={{ width: "100%", height: "100%" }} />
        </Icon>

        <Typography sx={{ fontSize: "1rem", color: "white" }}>
          <Box>
            <span style={{ fontWeight: "700" }}>We take care of storage </span>
            for you so focus on your pdf's.
          </Box>
        </Typography>
      </Stack>

      <Stack direction="column" spacing={2}>
        <Icon sx={{ width: "3rem", height: "3rem", color: "white" }}>
          <RestoreIcon sx={{ width: "100%", height: "100%" }} />
        </Icon>

        <Typography sx={{ fontSize: "1rem", color: "white" }}>
          <Box>
            <span style={{ fontWeight: "700" }}>Efficiency mainatined </span>
            while you're on the go.
          </Box>
        </Typography>
      </Stack>

      <Stack direction="column" spacing={2}>
        <Icon sx={{ width: "3rem", height: "3rem", color: "white" }}>
          <SendIcon sx={{ width: "100%", height: "100%" }} />
        </Icon>

        <Typography sx={{ fontSize: "1rem", color: "white" }}>
          <Box>
            <span style={{ fontWeight: "700" }}>Download and share</span>
            your work with ease.
          </Box>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EntryInfo;
