import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Fab, ToggleButton } from "@mui/material";
import { Add, PeopleOutline, Event } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

import BasicCard from "../components/BasicCard";

import { db } from "../firebase";
import {
  Timestamp,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmljbHF0IiwiYSI6ImNsOWR6YWk1ejA0Y2UzcG95djhucHlqaTEifQ.gHrtX5AcWucEpY3W3n1DQQ";

const MapView = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [eventsSelected, setEventsSelected] = useState(true);
  const [popupInfo, setPopupInfo] = useState();

  // Loads events and listens for upcoming ones.
  const loadEvents = () => {
    const type = eventsSelected ? "Event" : "Group";

    // Create the query to load the last 12 documents and listen for new ones.
    const recentEventsQuery = query(
      collection(db, "events"),
      where("type", "==", type),
      where("startDateTime", ">=", Timestamp.now())
    );

    // Start listening to the query.
    onSnapshot(recentEventsQuery, function (snapshot) {
      if (!snapshot.size) {
        setEvents([]);
      }

      const eventsList = [];
      snapshot.forEach((doc) => eventsList.push(doc.data()));
      setEvents(eventsList);

      // snapshot.docChanges().forEach(function (change) {
      //   if (change.type === "removed") {
      //     const newEvents = events.filter(
      //       (event) => event.id !== change.doc.id
      //     );
      //     setEvents(newEvents);
      //   }
      //   if (change.type === "modified") {
      //     console.log("Modified event: ", change.doc.data());
      //   }
      //   if (change.type === "removed") {
      //     console.log("Removed event: ", change.doc.data());
      //   }
      // });
    });
  };

  useEffect(() => {
    loadEvents();
    console.log("called load events");
  }, [eventsSelected]);

  const StyledFab = styled(Fab)({
    position: "absolute",
    zIndex: 1,
    top: "auto",
    bottom: 64,
    left: 0,
    right: 0,
    margin: "0 auto",
  });

  return (
    <>
      <Map
        initialViewState={{
          longitude: 103.7727,
          latitude: 1.2907,
          zoom: 13,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Box sx={{ display: "flex", justifyContent: "center", padding: 1 }}>
          <ToggleButton
            sx={{ color: "black", marginRight: 1 }}
            selected={eventsSelected}
            onChange={() => {
              setEventsSelected(true);
              setPopupInfo(null);
            }}
          >
            <Event sx={{ marginRight: 1 }} />
            Events
          </ToggleButton>
          <ToggleButton
            selected={!eventsSelected}
            onChange={() => {
              setEventsSelected(false);
              setPopupInfo(null);
            }}
            sx={{ color: "black" }}
          >
            <PeopleOutline sx={{ marginRight: 1 }} />
            Groups
          </ToggleButton>
        </Box>

        {events
          ? events.map((event) => (
              <Marker
                key={event.title}
                longitude={event.longitude}
                latitude={event.latitude}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  console.log(event);
                  e.originalEvent.stopPropagation();
                  setPopupInfo(event);
                }}
              ></Marker>
            ))
          : null}

        {popupInfo ? (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
          >
            <BasicCard {...popupInfo} style={{ mb: "0 !important" }} />
          </Popup>
        ) : null}
      </Map>
      <StyledFab color="secondary" onClick={() => navigate("/create")}>
        <Add />
      </StyledFab>
    </>
  );
};

export default MapView;
