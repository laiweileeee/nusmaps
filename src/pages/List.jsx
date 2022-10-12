import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import BasicCard from "../components/BasicCard";

import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { themeConfig } from "../theme/theme";

const List = () => {
  const [title, setTitle] = useState();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [loaded, setLoaded] = useState();

  const handleSubmit = async () => {
    // Add a new document in collection "events"
    await addDoc(collection(db, "events"), {
      name: title,
      timestamp: serverTimestamp(),
    });
  };

  // Loads events and listens for upcoming ones.
  const loadEvents = () => {
    // Create the query to load the last 12 documents and listen for new ones.
    const recentEventsQuery = query(
      collection(db, "events"),
      orderBy("timestamp", "desc"),
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
  }, []);

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
      {!loaded ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        events.map((data) => <BasicCard key={data.title} {...data} />)
      )}
    </Box>
  );
};

export default List;
