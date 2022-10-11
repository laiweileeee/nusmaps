// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

const Home = () => {
  const navigate = useNavigate();

  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: "auto",
    bottom: 60,
    left: 0,
    right: 0,
    margin: "0 auto",
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button variant="contained" onClick={() => navigate("/create")}>
        Create New
      </Button>
      <StyledFab color="primary" onClick={() => navigate("/create")}>
        <AddIcon />
      </StyledFab>
    </Box>
  );
};

export default Home;
