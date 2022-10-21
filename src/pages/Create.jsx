import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Place } from "@mui/icons-material";

import { NumericFormat } from "react-number-format";
import Map, { Marker } from "react-map-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmljbHF0IiwiYSI6ImNsOWR6YWk1ejA0Y2UzcG95djhucHlqaTEifQ.gHrtX5AcWucEpY3W3n1DQQ";

const useFormData = () => {
  const [type, setType] = useState("Event");
  const [title, setTitle] = useState("");
  const [longitude, setLongitude] = useState(103.7769);
  const [latitude, setLatitude] = useState(1.2959);
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState();

  return {
    type,
    setType,
    title,
    setTitle,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    location,
    setLocation,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    description,
    setDescription,
    capacity,
    setCapacity,
  };
};

// TODO: add input validation
const Create = () => {
  const {
    type,
    setType,
    title,
    setTitle,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    location,
    setLocation,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    description,
    setDescription,
    capacity,
    setCapacity,
  } = useFormData();

  const navigate = useNavigate();
  const [displayMap, setDisplayMap] = useState(false);

  const handleSubmit = async () => {
    console.log({
      title,
      description,
      capacity,
      type,
      location,
      longitude,
      latitude,
      startDateTime: Timestamp.fromDate(new Date(startDateTime)),
      endDateTime: Timestamp.fromDate(new Date(endDateTime)),
      timestamp: serverTimestamp(),
    });

    // Add a new document in collection "events"
    await addDoc(collection(db, "events"), {
      title,
      description,
      capacity,
      type,
      location,
      longitude,
      latitude,
      startDateTime: Timestamp.fromDate(new Date(startDateTime)),
      endDateTime: Timestamp.fromDate(new Date(endDateTime)),
      timestamp: serverTimestamp(),
    });

    navigate("/list");
  };

  // Custom number input bc material ui doesn't support it
  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    props,
    ref
  ) {
    return (
      <NumericFormat
        {...props}
        getInputRef={ref}
        decimalScale={0}
        allowNegative={false}
      />
    );
  });

  console.log("states ", {
    type,
    title,
    description,
    longitude,
    latitude,
    location,
    startDateTime,
    endDateTime,
    capacity,
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 10,
      }}
    >
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2, width: "100%" },
          display: "flex",
          flexDirection: "column",
          minWidth: 260,
          width: "90%",
        }}
      >
        <Typography variant="h5" sx={{ paddingTop: 2, paddingBottom: 1 }}>
          Create New Event
        </Typography>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(e) => {
            setType(e.target.value);
          }}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <ToggleButton value="Event">Event</ToggleButton>
          <ToggleButton value="Group">Group</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          id="outlined-basic"
          label="Title"
          value={title}
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          maxRows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          id="start-datetime-local"
          label="Start Date and Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          // only allow future dates
          inputProps={{
            min: new Date().toISOString().substring(0, 16),
          }}
          value={startDateTime}
          onChange={(e) => {
            setStartDateTime(e.target.value);
          }}
        />
        {/* TODO: valdiate date input */}
        <TextField
          id="end-datetime-local"
          label="End Date and Time"
          type="datetime-local"
          // disable end date time input until user enters start date time
          disabled={startDateTime ? false : true}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: startDateTime,
          }}
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
        />
        <FormControl variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel htmlFor="location">Location</InputLabel>
          <OutlinedInput
            id="location"
            value={location}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setDisplayMap(true);
                  }}
                  edge="end"
                >
                  <Place />
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </FormControl>

        <TextField
          label="Capacity"
          value={capacity}
          onBlur={(e) => setCapacity(e.target.value)}
          name="numberformat"
          id="outlined-basic"
          variant="outlined"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </Box>

      <Button variant="contained" onClick={handleSubmit}>
        Create Event
      </Button>

      <Modal
        open={displayMap}
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          padding: "5%",
        }}
        onClose={() => {
          setDisplayMap(false);
        }}
      >
        <>
          <Map
            initialViewState={{
              longitude: 103.7727,
              latitude: 1.2907,
              zoom: 13,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ borderRadius: 10, marginBottom: 8 }}
          >
            <Marker
              longitude={longitude}
              latitude={latitude}
              draggable
              style={{ cursor: "pointer" }}
              onDragEnd={(e) => {
                setLongitude(e.lngLat.lng);
                setLatitude(e.lngLat.lat);
              }}
            ></Marker>
          </Map>
          <Button
            variant="contained"
            onClick={() => {
              setDisplayMap(false);
            }}
          >
            Set Location
          </Button>
        </>
      </Modal>
    </Box>
  );
};

export default Create;
