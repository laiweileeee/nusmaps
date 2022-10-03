import React, { useState } from "react";

import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CreatePage = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [description, setDescription] = useState("");

  const [slots, setSlots] = useState();

  const handleSubmit = async () => {
    // Add a new document in collection "events"
    await addDoc(collection(db, "events"), {
      name,
      description,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      timestamp: serverTimestamp(),
    });
  };

  console.log("date", startDate);

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
      <Typography variant="h5">Create New Event</Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Name"
          value={name}
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          maxRows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
      <Button variant="contained" onClick={handleSubmit}>
        Add Event
      </Button>
    </Box>
  );
};

export default CreatePage;
