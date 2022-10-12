import React, { useCallback, useState } from "react";
import { Box, Typography, TextField, Button, Fab } from "@mui/material";
import { db } from "../firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Map from "react-map-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGFrb3lha2lib2kiLCJhIjoiY2w4ZDNqaWVxMDhoMDN1bXU3YnhjY2l4aSJ9.ExOH_cBWlKCcr3qQHLEA2Q";

const MapView = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = React.useState({
    longitude: 103.7727,
    latitude: 1.2907,
    zoom: 13,
  });

  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: "auto",
    bottom: 60,
    left: 0,
    right: 0,
    margin: "0 auto",
  });

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  return (
    <>
      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      />
      {/*<Button variant="contained" onClick={() => navigate("/create")}>*/}
      {/*  Create Event*/}
      {/*</Button>*/}
      <StyledFab color="secondary" onClick={() => navigate("/create")}>
        <AddIcon />
      </StyledFab>
    </>
  );
};

export default MapView;
