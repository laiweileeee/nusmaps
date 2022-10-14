import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, ToggleButton } from "@mui/material";

import BasicCard from "../components/BasicCard";

import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { themeConfig } from "../theme/theme";

const ListView = () => {
  const [title, setTitle] = useState();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [loaded, setLoaded] = useState();
  const [eventsSelected, setEventsSelected] = useState(true);
  const [earliestSelected, setEarliestSelected] = useState(true);

  const handleSubmit = async () => {
    // Add a new document in collection "events"
    await addDoc(collection(db, "events"), {
      name: title,
      timestamp: serverTimestamp(),
    });
  };

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
          minWidth: 330,
          maxWidth: 350,
          paddingBottom: 2,
        }}
      >
        <Typography variant="h6" component="div">
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
        <>
          {events.length > 0 ? (
            events.map((data) => <BasicCard key={data.title} {...data} />)
          ) : (
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                minWidth: 330,
                maxWidth: 350,
              }}
            >
              <Typography variant="h6" component="div">
                {eventsSelected ? "No events found." : "No groups found."}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ListView;
