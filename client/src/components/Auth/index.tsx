import { Stack, Button, darken, Typography, Icon } from "@mui/material";
import React, { useContext } from "react";
import { GMQ } from "../reducers";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { ImTwitter } from "react-icons/im";
import { IconType } from "react-icons";
import OAuthFlow from "../Auth/OAuth";
import { GoogleAuthProvider, FacebookAuthProvider, User } from "firebase/auth";

import { connect } from "react-redux";
import { addGlobalUser, UserData } from "../actions";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Context } from "../Layout";

interface Props {
  breakpoint: GMQ;
  addGlobalUser: (user: User) => UserData;
}

interface OAuthData {
  name?: string | null;
  email?: string | null;
  profilePic?: string | null;
}

const OAuth: React.FC<Props> = (props: Props) => {
  const { showModal, setModal } = useContext(Context)[1];

  const callOAuth = async (to: string) => {
    const services = to.toLowerCase();
    let user: User | null = null;

    switch (services) {
      case "google":
        user = await new OAuthFlow(new GoogleAuthProvider()).OAuth();
        break;
      case "facebook":
        user = await new OAuthFlow(new FacebookAuthProvider()).OAuth();
        break;
    }

    const newUser: OAuthData = Object.assign(
      {},
      {
        name: user?.displayName,
        email: user?.email,
        profilePic: user?.photoURL,
      }
    );

    const ack = await sendUserInfo(newUser);
  
    if (ack?.code !== "ERR_NETWORK") {
      props.addGlobalUser(user as User);
      setModal(false);
    }

    else return;
  };

  async function sendUserInfo(user: OAuthData) {
    try {
      const { data } = await axios.post<AxiosResponse>(
        "http://localhost:5000/api/v1/entry/signUp",
        user
      );

      return data;
    } catch (error: any) {
      return error;
    }
  }

  const generateOAuth = () => {
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
    ];

    return arr.map((item: Ic, idx: number) => {
      return (
        <Button
          key={idx}
          variant="contained"
          color="primary"
          onClick={() => callOAuth(item.text)}
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

  const { tabLand, desktop } = props.breakpoint;
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
      {generateOAuth()}
    </Stack>
  );
};

export default connect(null, { addGlobalUser })(OAuth);
