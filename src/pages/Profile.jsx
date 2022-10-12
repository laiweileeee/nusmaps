import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Stack,
  Container,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log(user);

  return (

    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "top",
        paddingTop: "10%",
        alignItems: "center",
        overflow: "auto",
        height: "100%",
        width: "100%",
      }}
    >
      <Stack direction="column" spacing={6} sx={{justifyContent: "center", alignItems: "center"}}>
        <Stack direction="row" spacing={3} sx={{justifyContent: "center", alignItems: "center"}}>
          <Avatar src={user?.photoURL} sx={{ width: 55, height: 55 }} />
          <Stack direction="column" spacing={1}>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.displayName}
            </Typography>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.email}
            </Typography>
          </Stack>
        </Stack>

        <Stack>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              OTHER PROFILE INFO
            </Typography>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.email}
            </Typography>
        </Stack>
      </Stack>

    </Box>

  );
};

export default Profile;