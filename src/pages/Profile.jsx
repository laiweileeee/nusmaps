import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Stack,
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
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <Stack direction="column" spacing={2}>
        <Avatar src={user?.photoURL} />
        <Typography
          sx={{ fontSize: "medium", maxWidth: 200, mb: 2 }}
          color="text.primary"
        >
          {user?.displayName}
        </Typography>
        <Typography
          sx={{ fontSize: "medium", maxWidth: 200, mb: 2 }}
          color="text.primary"
        >
          {user?.email}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Profile;
