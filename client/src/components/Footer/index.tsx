/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  TextField,
  styled,
  Button,
} from "@mui/material";
import Logo from "../Logo";
import { GMQ } from "../reducers";
import Heading from "../Heading";

interface Props {
  breakpoint: GMQ;
}

const ContactTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#5996f7",
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#434E5B",
    },
    "&:hover fieldset": {
      borderColor: "#5996f7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5996f7",
    },
  },

  "& .MuiFormLabel-root": {
    color: "#c3d8fa",
  },

  "& .MuiInputBase-input": {
    color: "#c3d8fa",
  },
});

const product = ["Product", "About", "Help"];
const site = ["Site", "Sitemap", "Resources"];

const GenFootList = (props: { list: string[] }) => {
  const list = props.list.map((ele: string, idx: number) => {
    return (
      <ListItem disablePadding key={idx}>
        <ListItemText sx={{ margin: "0" }}>
          {idx === 0 ? (
            <Heading
              sx={{
                color: "secondary.light",
                fontWeight: "700",
                fontSize: "1rem",
              }}
            >
              {ele}
            </Heading>
          ) : (
            <Typography
              component="span"
              sx={[
                {
                  fontSize: ".9rem",
                  color: "secondary.light",
                  transition: ".2s",
                  display: "inline-block",
                  cursor: "pointer",
                },
                {
                  "&:hover": {
                    transform: "translateY(-5px)",
                    color: "#5996f7",
                    borderRadius: "3px",
                  },
                },
              ]}
            >
              {ele}
            </Typography>
          )}
        </ListItemText>
      </ListItem>
    );
  });

  return <>{list}</>;
};

interface Contact {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

interface ContactErr {
  error?: string;
  msg?: string;
}

export default function Footer(props: Props) {
  const { mobile, tabPort, tabLand, desktop } = props.breakpoint;
  const [formData, setForm] = useState<Contact>({});
  const [err, setErr] = useState<ContactErr[]>([]);
  // const ref = useRef<Contact>(null);

  const isAlAdded = (name: string, errArr: ContactErr[]) => {
    const al = errArr.find((e) => e.error === name);
    return al ? true : false;
  };

  const checkNum = (name: string, value: string, errArr: ContactErr[]) => {
    const err: ContactErr = {};
    if (value !== "" && Number.isFinite(+value)) {
      err.error = name;
      err.msg = "Numbers not allowed";
      if (!isAlAdded(name, errArr)) errArr.push(err);
      return true;
    }

    return false;
  };

  const checkEmail = (name: string, value: string, errArr: ContactErr[]) => {
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const res = reg.test(value);
    const err: ContactErr = {};

    if (res && value !== "") {
      err.error = name;
      err.msg = "Invalid Email";
      if (!isAlAdded(name, errArr)) errArr.push(err);
      return true;
    }

    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Contact;
    const value = e.target.value.trim();
    let errFound = false;

    if (checkNum(name, value, err)) errFound = true;
    if (checkEmail(name, value, err)) errFound = true;

    if (errFound) {
      setErr([...err]);
      return;
    }

    formData[name] = value;
    err.forEach((e, idx) => {
      if (e.error === name) err.splice(idx, 1);
    });

    setErr([...err]);
    setForm({ ...formData });
  };

  let idx = -1;
  const findErr = (name: keyof Contact) => {
    const f = err.find((e, i) => {
      if (e.error === name) idx = i;
      return e.error === name;
    });
    return f ? f : false;
  };

  return (
    <Box sx={{ pt: "4rem" }}>
      <Stack
        sx={{
          bgcolor: "secondary.dark",
          flexGrow: 1,
          py: "2rem",
          pl: mobile ? "1rem" : "4rem",
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={8} lg={3}>
            <Stack direction="column" spacing={3} sx={{ pt: "0.25rem" }}>
              <Logo color="secondary.light" />
              <Typography sx={{ color: "secondary.light" }}>
                Power to pdf's
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} lg={3}>
            <List disablePadding>
              <Stack spacing={3}>
                <GenFootList list={product} />
              </Stack>
            </List>
          </Grid>

          <Grid item xs={12} sm={5} lg={2}>
            <List disablePadding>
              <Stack spacing={3}>
                <GenFootList list={site} />
              </Stack>
            </List>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Box component="form" autoComplete="off">
              <Heading
                sx={{
                  color: "secondary.light",
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                Contact
              </Heading>

              <Grid container spacing={3} sx={{ mt: "1rem" }}>
                <Grid item xs={12} sm={6} lg={5}>
                  <ContactTextField
                    id="outlined-multiline-flexible"
                    name="firstName"
                    label="First Name"
                    multiline
                    maxRows={4}
                    onChange={handleChange}
                    error={findErr("firstName") ? true : false}
                    helperText={findErr("firstName") ? err[idx]?.msg : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={5}>
                  <ContactTextField
                    id="outlined-multiline-flexible"
                    name="lastName"
                    label="Last Name"
                    multiline
                    maxRows={4}
                    onChange={handleChange}
                    error={findErr("lastName") ? true : false}
                    helperText={findErr("lastName") ? err[idx]?.msg : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={10}>
                  <ContactTextField
                    id="outlined-multiline-flexible"
                    name="email"
                    label="Email"
                    multiline
                    maxRows={4}
                    sx={[!mobile && { width: "100%" }]}
                    onChange={handleChange}
                    error={findErr("email") ? true : false}
                    helperText={findErr("email") ? err[idx]?.msg : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={10}>
                  <ContactTextField
                    id="outlined-multiline-flexible"
                    name="address"
                    label="Address"
                    multiline
                    minRows={5}
                    sx={[!mobile && { width: "100%" }]}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={10}>
                  <Button
                    variant="outlined"
                    sx={[
                      {
                        letterSpacing: "3px",
                        color: "#5996f7",
                        fontSize: "1rem",
                        border: "1px solid #434E5B",
                        p: "1rem 2rem",
                        transition: ".2s"
                      },

                      {
                        "&:hover": {
                          borderColor: "#5996f7",
                        },
                      },
                    ]}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
