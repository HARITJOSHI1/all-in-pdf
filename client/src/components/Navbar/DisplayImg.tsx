import { User } from "firebase/auth";
import React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";

interface Props {
  user: User;
}

const DisplayImg: React.FC<Props> = (props) => {
  const {user} = props;  
  return (
    <Box>
      <Avatar alt="User" src={user.photoURL as string} />
    </Box>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: state.user as User,
  };
};

export default connect(mapStateToProps)(DisplayImg);
