import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useForm, SubmitHandler, Controller, FormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Button,
  CardActions,
  darken,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { padding, width } from "@mui/system";
import { GMQ, State } from "../reducers";
import Entry from "./index";
import axios, { AxiosResponse } from "axios";
import { Grid } from "react-loader-spinner";
import { connect } from "react-redux";
import { FormDataUser, addGlobalUser, UserData } from "../actions";
import { log } from "console";

const Schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(14).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required(),
});

interface Props {
  breakpoint: GMQ;
  addGlobalUser: (user: FormDataUser) => UserData;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC<Props> = (props: Props) => {
  const { control, handleSubmit, formState } = useForm<SignUpState>({
    resolver: yupResolver(Schema),
  });

  const {mobile, tabPort, tabLand, desktop} = props.breakpoint;
  const [isSubmit, setSubmit] = useState(false);

  const onSubmit: SubmitHandler<SignUpState> = async (data: SignUpState) => {
    if (!isSubmit) {
      try {
        setSubmit(true);
        const res = await axios.post<AxiosResponse>(
          "http://localhost:5000/api/v1/entry/signup",
          data
        );

        if (res.data) {
          props.addGlobalUser(data);
          setSubmit(false);
          props.setModal(false);
        }
      } catch (err: any) {
        console.log(err.message);
        setSubmit(false);
      }
    }
  };

  const createLabel = (l: string, i: number) => {
    const newStr = l.replace(l[0], l[0].toUpperCase());
    if (i === 2) {
      return newStr.replace("P", " P");
    }

    return newStr.replace(l[0], l[0].toUpperCase());
  };

  const generateInputText = ({ errors }: FormState<SignUpState>) => {
    const labels: ("email" | "password" | "confirmPassword")[] = [
      "email",
      "password",
      "confirmPassword",
    ];
    return labels.map(
      (l: "email" | "password" | "confirmPassword", idx: number) => {
        return (
          <Controller
            name={l}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                size="small"
                sx={{ width: "100%" }}
                label={createLabel(l, idx)}
                error={!!errors.email}
                FormHelperTextProps={{
                  style: {
                    marginTop: "0.25rem",
                    marginBottom: "0.25rem",
                  },
                }}
                helperText={errors[l] ? errors[l]?.message : " "}
              />
            )}
          />
        );
      }
    );
  };

  
  return (
    <Entry breakpoint={props.breakpoint}>
      <Stack
        direction="column"
        alignItems="center"
        sx={[
          { width: "100%" },
          tabPort && { width: "90%" },
          mobile && { width: "100%" },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          {generateInputText(formState)}

          <Button
            variant="contained"
            type="submit"
            sx={{
              position: "relative",
              bgcolor: "#5340FF",
              boxShadow: "none",
              borderRadius: "10px",
              textTransform: "none",
              width: "100%",
              p: ".8rem 4rem",
              mt: desktop || tabLand ? "1rem" : "0",
              "&:hover": {
                bgcolor: darken("#5340FF", 0.2),
              },
            }}
          >
            {!isSubmit ? (
              <Typography
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                Submit
              </Typography>
            ) : (
              <Grid
                ariaLabel="loading-indicator"
                color="white"
                width="1.5rem"
                height="1.5rem"
              />
            )}
          </Button>
        </form>
      </Stack>
    </Entry>
  );
};

export default connect(null, { addGlobalUser })(SignUp);
