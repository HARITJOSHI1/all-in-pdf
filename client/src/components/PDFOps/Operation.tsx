import React from "react";
import { GMQ, State } from "../reducers";
import Drop from "./Dropzone/Drop";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { PDFOperations, OPERATIONS } from "./Operations";
import { Stack, Typography } from "@mui/material";

interface MatchParams {
  name: keyof PDFOperations;
}

interface Props extends RouteComponentProps<MatchParams> {
  breakpoint: GMQ;
}

function _Operation(props: Props) {
  const PARAM = props.match.params.name;
  const obj = OPERATIONS[PARAM];

  return (
    <>
      <section>
        <Stack direction= "row" justifyContent="center" sx={{ py: "4rem" }}>
          <Typography variant="h3">{obj.name}</Typography>
        </Stack>
      </section>

      <section>
        <Drop breakpoint={props.breakpoint} param={PARAM} />
      </section>
    </>
  );
}

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint as GMQ,
  };
};

export default connect(mapStateToProps)(_Operation);
