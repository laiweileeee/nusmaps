// src/pages/Home.js
import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
    </Box>
  );
};

export default Home;
