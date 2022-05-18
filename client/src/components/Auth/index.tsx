import { Stack, Button, darken, Typography, Icon } from "@mui/material";
import React, { Component } from "react";
import { GMQ } from "../reducers";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { ImTwitter } from "react-icons/im";
import { IconType } from "react-icons";
import OAuthFlow from "../Auth/OAuth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  User,
} from "firebase/auth";

import { connect } from "react-redux";
import { addGlobalUser, UserData } from "../actions";

interface Props {
  breakpoint: GMQ;
  addGlobalUser: (user: User) => UserData;
}

class OAuth extends Component<Props> {
  callOAuth = async (to: string) => {
    const services = to.toLowerCase();
    let user: User | null = null;

    switch (services) {
      case "google":
        user = await new OAuthFlow(new GoogleAuthProvider()).OAuth();
        this.props.addGlobalUser(user);
        break;
      case "facebook":
        user = await new OAuthFlow(new FacebookAuthProvider()).OAuth();
        this.props.addGlobalUser(user);
        break;
      case "twitter":
        user = await new OAuthFlow(new TwitterAuthProvider()).OAuth();
        this.props.addGlobalUser(user);
        break;
    }
  };

  generateOAuth = () => {
    type Ic = {
      icon: IconType;
      color?: string;
      text: string;
    };

    const arr: Ic[] = [
      {
        icon: BsFacebook,
        color: "#3b5998",
        text: "Facebook",
      },
      {
        icon: FcGoogle,
        text: "Google",
      },

      {
        icon: ImTwitter,
        color: "#1da1f2",
        text: "Twitter",
      },
    ];

    return arr.map((item: Ic, idx: number) => {
      return (
        <Button
          key={idx}
          variant="contained"
          color="primary"
          onClick={() => this.callOAuth(item.text)}
          sx={{
            position: "relative",
            bgcolor: "#EFF0F4",
            boxShadow: "none",
            borderRadius: "10px",
            textTransform: "none",
            width: "100%",
            color: "black",

            "&:hover": {
              backgroundColor: darken("#EFF0F4", 0.1),
              boxShadow: "none",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon
              sx={{
                color: item?.color,
                width: "auto",
                height: "auto",
                alignSelf: "stretch",
                fontSize: "1.2rem",
              }}
            >
              <item.icon style={{ width: "100%", height: "100%" }} />
            </Icon>

            <Typography variant="h6" sx={{ fontSize: ".9rem" }}>
              {item.text}
            </Typography>
          </Stack>
        </Button>
      );
    });
  };

  render() {
    const { tabLand, desktop } = this.props.breakpoint;
    return (
      <Stack
        direction={desktop || tabLand ? "row" : "column"}
        justifyContent="space-between"
        spacing={2}
        alignItems="center"
        sx={{
          mt: "1rem",
          width: "100%",
          pb: desktop || tabLand ? "2rem" : "0",
        }}
      >
        {this.generateOAuth()}
      </Stack>
    );
  }
}


export default connect(null, {addGlobalUser})(OAuth);