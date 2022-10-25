import { User } from "firebase/auth";
import React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
import { NewUser } from "../actions";

interface Props {
  user: NewUser;
}

const DisplayImg: React.FC<Props> = (props) => {
  const {user} = props;  
  
  return (
    <Box>
      <Avatar alt="User" src={user.profilePic} />
    </Box>
  );
};

const mapStateToProps = (state: State) => {
  return {
    user: state.user as NewUser,
  };
};

export default connect(mapStateToProps)(DisplayImg);
