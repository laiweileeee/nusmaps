import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  Box,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Map as MapIcon } from "@mui/icons-material";
import TuneIcon from "@mui/icons-material/Tune";

import Map, { Marker, Popup, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

import BasicCard from "../components/BasicCard";
import { Geocoder } from "../components/Geocoder";

import { db } from "../firebase";
import {
  Timestamp,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { StyledFab } from "../components/StyledFab";

import { AuthContext } from "../contexts/AuthProvider";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmljbHF0IiwiYSI6ImNsOWR6YWk1ejA0Y2UzcG95djhucHlqaTEifQ.gHrtX5AcWucEpY3W3n1DQQ";

const MapView = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [viewState, setViewState] = useState({
    longitude: 103.7727,
    latitude: 1.2907,
    zoom: 13,
  });
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [eventsSelected, setEventsSelected] = useState(true);
  const [groupsSelected, setGroupsSelected] = useState(true);
  const [popupInfo, setPopupInfo] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Loads events and listens for upcoming ones.
  const loadEvents = () => {
    let recentEventsQuery;

    if (eventsSelected && groupsSelected) {
      recentEventsQuery = query(
        collection(db, "events"),
        where("startDateTime", ">=", Timestamp.now())
      );
    } else {
      const type = eventsSelected ? "Event" : "Group";

      recentEventsQuery = query(
        collection(db, "events"),
        where("type", "==", type),
        where("startDateTime", ">=", Timestamp.now())
      );
    }
    // Create the query to load the last 12 documents and listen for new ones.

    // Start listening to the query.
    onSnapshot(recentEventsQuery, function (snapshot) {
      if (!snapshot.size) {
        setEvents([]);
      }

      const eventsList = [];
      snapshot.forEach((doc) => eventsList.push(doc));
      setEvents(eventsList);
    });
  };

  useEffect(() => {
    loadEvents();
    console.log("called load events");
  }, [eventsSelected, groupsSelected]);

  return (
    <>
      {/* <AppBar position="static">
        <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
          {" "}
          <MapIcon sx={{ marginRight: "2%" }} />
          <Typography
            sx={{
              justifyContent: "start",
              fontSize: "large",
              maxWidth: 200,
              mb: 0,
            }}
          >
            NUS MAPS
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        reuseMaps
      >
        <GeolocateControl showAccuracyCircle={false} />
        <Geocoder position="top-left" />

        {events
          ? events.map((event) => (
              <Marker
                key={event.data().title}
                longitude={event.data().longitude}
                latitude={event.data().latitude}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(event);
                }}
              />
            ))
          : null}

        {popupInfo ? (
          <Popup
            anchor="top"
            longitude={popupInfo.data().longitude}
            latitude={popupInfo.data().latitude}
            onClose={() => setPopupInfo(null)}
          >
            <BasicCard
              key={popupInfo.data().title}
              eventUid={popupInfo.id}
              {...popupInfo.data()}
              style={{ mb: "0 !important" }}
            />
          </Popup>
        ) : null}
      </Map>
      <Box className="filter" onClick={handleClick}>
        <TuneIcon sx={{ color: "black" }} />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            if (eventsSelected) {
              setGroupsSelected(true);
            }
            setEventsSelected(!eventsSelected);
          }}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={eventsSelected}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "Events" }}
            />
          </ListItemIcon>
          <ListItemText primary={"Events"} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (groupsSelected) {
              setEventsSelected(true);
            }
            setGroupsSelected(!groupsSelected);
          }}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={groupsSelected}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "Groups" }}
            />
          </ListItemIcon>
          <ListItemText primary={"Groups"} />
        </MenuItem>
      </Menu>

      {user ? (
        <StyledFab color="secondary" onClick={() => navigate("/create")}>
          <Add />
        </StyledFab>
      ) : null}
    </>
  );
};

export default MapView;
