import React, { useState } from "react";
import { Box, Typography, TextField, Button, Fab } from "@mui/material";
import { db } from "../firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

const Map = () => {
  const [title, setTitle] = useState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Add a new document in collection "events"
    await addDoc(collection(db, "events"), {
      name: title,
      timestamp: serverTimestamp(),
    });
  };

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
        Create Event
      </Button>
      <StyledFab color="secondary" onClick={() => navigate("/create")}>
        <AddIcon />
      </StyledFab>
    </Box>
  );
};

export default Map;
