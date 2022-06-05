import React, { ReactNode } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Stack, TextField } from "@mui/material";
import { width } from "@mui/system";
import { GMQ } from "../reducers";
import Entry from "./index";

const Schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).max(6).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required(),
});

interface Props {
  breakpoint: GMQ;
}

interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp(props: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpState>({
    resolver: yupResolver(Schema),
  });

  const onSubmit: SubmitHandler<SignUpState> = (data) => {
    console.log(data);
  };

  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;

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
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                size="small"
                sx={{ width: "100%" }}
                label="Email"
                error={!!errors.email}
                inputProps={{ style: { fontSize: ".8rem" } }}
                InputLabelProps={{ style: { fontSize: ".8rem" } }}
                helperText={errors.email ? errors.email?.message : " "}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ width: "100%" }}
                size="small"
                label="Password"
                error={!!errors.password}
                helperText={errors.password ? errors.password?.message : " "}
                inputProps={{ style: { fontSize: ".8rem" } }}
                InputLabelProps={{ style: { fontSize: ".8rem" } }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ width: "100%" }}
                size="small"
                label="Confirm Password"
                error={!!errors.confirmPassword}
                inputProps={{ style: { fontSize: ".8rem" } }}
                InputLabelProps={{ style: { fontSize: ".8rem" } }}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword?.message : ""
                }
              />
            )}
          />
        </form>
      </Stack>
    </Entry>
  );
}
