import React from "react";
import { connect } from "react-redux";
import { GMQ, State } from "../reducers";
import Section1 from "./Section1";

interface Props {
  breakpoint: GMQ;
}

const _HomePage: React.FC<Props> = ({breakpoint}) => {
  return (
      <Section1 />
  );
};

const mapStateToProps = (state: State) => {
  return {
    breakpoint: state.breakpoint,
  };
};

export default connect(mapStateToProps)(_HomePage);
