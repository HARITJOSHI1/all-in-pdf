import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { connect } from "react-redux";
import { State, GMQ } from "../reducers";
import Tools from "../tools/Tools";
import { OPERATIONS } from "../PDFOps/Operations";

interface Props {
  breakpoint: GMQ;
}

const ShowAllToolsPage: React.FC<Props> = (props) => {
  return (
    <section style={{marginTop: "5rem", marginBottom: "2rem"}}>
      <Grid alignItems="center" justifyContent="center" container>
        <Grid item xs={12} sm={8} md={6} lg={7}>
          <Stack
            direction="column"
            spacing={3}
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h2"
              sx={[
                {
                  fontSize: "3rem",
                  textAlign: "center",
                  mb: "2rem"
                },
                props.breakpoint.mobile && { fontSize: "2.5rem" },
              ]}
            >
              Here are all the tools which you can use
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={10} md={9} lg={7}>
          <Grid container spacing={4}>
            <Tools breakpoint={props.breakpoint} count={9} />
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
  };
};

export default connect(mapStateToProps)(ShowAllToolsPage);
