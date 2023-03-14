import React from "react";
import { Grid, Stack } from "@mui/material";

export default function PDFTranslator() {
  return (
    <section style={{width: '90%'}}>
      <Grid container spacing={17}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack sx={{bgcolor: 'red'}}>PDF Viewer</Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack sx={{bgcolor: 'blue'}}>Lang Selector</Stack>
        </Grid>
      </Grid>
    </section>
  );
}
