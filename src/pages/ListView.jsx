import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  ToggleButton,
  Typography,
} from "@mui/material";

import BasicCard from "../components/BasicCard";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

const ListView = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [loaded, setLoaded] = useState();
  const [eventsSelected, setEventsSelected] = useState(true);
  const [earliestSelected, setEarliestSelected] = useState(true);

  // Loads events and listens for upcoming ones.
  const loadEvents = () => {
    const type = eventsSelected ? "Event" : "Group";

    // Create the query to load the last 12 documents and listen for new ones.
    const recentEventsQuery = query(
      collection(db, "events"),
      where("type", "==", type),
      where("startDateTime", ">=", Timestamp.now()),
      orderBy("startDateTime", "asc"),
      limit(12)
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

    setLoaded(true);
  };

  useEffect(() => {
    loadEvents();
    console.log("called load events");
  }, [eventsSelected, earliestSelected]);

  console.log("events ", events);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        paddingTop: 3,
        paddingBottom: 10,
      }}
    >
      <Box
        sx={{
          minWidth: 260,
          width: "90%",
          paddingBottom: 2,
        }}
      >
        <Button variant="outlined" onClick={() => navigate("/create")}>
          Create Event
        </Button>
        <Typography variant="h6" component="div" sx={{ marginTop: 1 }}>
          Type
        </Typography>
        <ToggleButton
          sx={{ marginRight: 1 }}
          selected={eventsSelected}
          onChange={() => {
            setEventsSelected(true);
          }}
        >
          Events
        </ToggleButton>
        <ToggleButton
          selected={!eventsSelected}
          onChange={() => {
            setEventsSelected(false);
          }}
        >
          Groups
        </ToggleButton>

        <Typography variant="h6" component="div" sx={{ marginTop: 1 }}>
          Sort
        </Typography>
        <ToggleButton
          sx={{ marginRight: 1 }}
          selected={earliestSelected}
          onChange={() => {
            setEarliestSelected(!earliestSelected);
          }}
        >
          Earliest First
        </ToggleButton>
        <ToggleButton
          selected={!earliestSelected}
          onChange={() => {
            setEarliestSelected(!earliestSelected);
          }}
        >
          Nearest First
        </ToggleButton>
      </Box>

      {!loaded ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "Column",
            flexGrow: 1,
            minWidth: 260,
            width: "90%",
          }}
        >
          {events.length > 0 ? (
            events.map((data) => <BasicCard key={data.title} {...data} />)
          ) : (
            <Typography variant="h6" component="div">
              {eventsSelected ? "No events found." : "No groups found."}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ListView;
