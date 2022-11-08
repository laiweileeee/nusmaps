import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import { NumericFormat } from "react-number-format";
import Map, { Marker } from "react-map-gl";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";

import { Geocoder } from "../components/Geocoder";
import { AuthContext } from "../contexts/AuthProvider";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const Create = ({ event }) => {
  const { user } = useContext(AuthContext);

  const { handleSubmit, control, watch, setValue } = useForm({
    defaultValues: event,
  });
  const watchFields = watch(["startDateTime", "endDateTime", "coordinates"]);

  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [editHeader, setEditHeader] = useState("Event");

  const onSubmit = async (data) => {
    // Add a new document in collection "events"
    if (!event) {
      await addDoc(collection(db, "events"), {
        title: data.title,
        description: data.description,
        capacity: data.capacity,
        type: data.type,
        location: data.location,
        latitude: data.coordinates[0],
        longitude: data.coordinates[1],
        startDateTime: Timestamp.fromDate(new Date(data.startDateTime)),
        endDateTime: Timestamp.fromDate(new Date(data.endDateTime)),
        creatorId: user.uid,
        creatorName: user.displayName,
        timestamp: serverTimestamp(),
      });

      navigate("/list");
    } else {
      // Update doc
      const docRef = doc(db, "events", event.eventId);
      await updateDoc(docRef, {
        title: data.title,
        description: data.description,
        capacity: data.capacity,
        type: data.type,
        location: data.location,
        latitude: data.coordinates[0],
        longitude: data.coordinates[1],
        startDateTime: Timestamp.fromDate(new Date(data.startDateTime)),
        endDateTime: Timestamp.fromDate(new Date(data.endDateTime)),
      });
      navigate("/profile");
    }
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={(theme) => ({
          "& .MuiTextField-root": { mb: 2, width: "100%" },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 260,
          padding: 2,
          paddingBottom: 10,
          [theme.breakpoints.up("sm")]: {
            width: 600,
            marginRight: "auto",
            marginLeft: "auto",
          },
        })}
      >
        <Typography
          variant="h5"
          sx={{ paddingTop: 2, paddingBottom: 1, alignSelf: "flex-start" }}
        >
          {event ? "Edit" : "Create New"} {editHeader}
        </Typography>

        <Controller
          name="type"
          control={control}
          defaultValue="Event"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ToggleButtonGroup
              value={value}
              exclusive
              onChange={(evt, val) => {
                if (val !== null) {
                  setEditHeader(val);
                  onChange(val);
                }
              }}
              defaultValue="Event"
              fullWidth
              sx={{ marginBottom: 2 }}
              size="small"
            >
              <ToggleButton value="Event">Event</ToggleButton>
              <ToggleButton value="Group">Group</ToggleButton>
            </ToggleButtonGroup>
          )}
          rules={{ required: "Type is required" }}
        />

        <Controller
          name="title"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              required
            />
          )}
          rules={{ required: "Title is required" }}
        />

        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id="outlined-multiline-flexible"
              label="Description"
              variant="outlined"
              multiline
              maxRows={4}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              required
            />
          )}
          rules={{ required: "Description is required" }}
        />

        <Controller
          name="startDateTime"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id="start-datetime-local"
              label="Start Date and Time"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().substring(0, 16),
              }}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              required
            />
          )}
          rules={{
            required: "Start date and time is required",
            validate: (value) =>
              moment(value) < moment(watchFields[1]) ||
              "Start date and time must be before end date and time",
          }}
        />

        <Controller
          name="endDateTime"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id="end-datetime-local"
              label="End Date and Time"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().substring(0, 16),
              }}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              required
            />
          )}
          rules={{
            required: "End date and time is required",
            validate: (value) =>
              moment(value) > moment(watchFields[0]) ||
              "End date and time must be after start date and time",
          }}
        />

        <Controller
          name="coordinates"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
              variant="outlined"
              sx={{ marginBottom: 2 }}
              onClick={() => setDisplayMap(true)}
              fullWidth
              error={!!error}
              required
            >
              <InputLabel htmlFor="coordinates">Coordinates</InputLabel>
              <OutlinedInput
                id="coordinates"
                label="Coordinates"
                value={value}
                onChange={onChange}
                readOnly
              />
              <FormHelperText>{error ? error.message : null}</FormHelperText>
            </FormControl>
          )}
          rules={{ required: "Coordinates are required" }}
        />

        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Tooltip
              title="Please input location details (eg. COM2 Seminar Room 1)."
              sx={{ width: "90%" }}
              open={showTooltip}
              arrow={true}
            >
              <FormControl
                variant="outlined"
                sx={{ marginBottom: 2 }}
                onClick={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                fullWidth
                error={!!error}
                required
              >
                <InputLabel htmlFor="location">Location</InputLabel>
                <OutlinedInput
                  id="location"
                  label="Location"
                  value={value}
                  onChange={onChange}
                  autoComplete="off"
                />
                <FormHelperText>{error ? error.message : null}</FormHelperText>
              </FormControl>
            </Tooltip>
          )}
          rules={{ required: "Location is required" }}
        />

        <Controller
          name="capacity"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id="outlined-basic"
              label="Capacity"
              variant="outlined"
              name="numberformat"
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
          rules={{ required: "Capacity is required" }}
        />

        <Button type="submit" variant="contained">
          {event ? "Edit" : "Create"} {editHeader}
        </Button>
      </Box>

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
            reuseMaps
            style={{ borderRadius: 10, marginBottom: 8 }}
            onClick={(e) =>
              setValue("coordinates", [e.lngLat.lat, e.lngLat.lng])
            }
          >
            <Geocoder position="top-left" />
            {watchFields[2] ? (
              <Marker
                longitude={watchFields[2][1]}
                latitude={watchFields[2][0]}
                draggable
                style={{ cursor: "pointer" }}
                onDragEnd={(e) =>
                  setValue("coordinates", [e.lngLat.lat, e.lngLat.lng])
                }
              ></Marker>
            ) : null}
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
    </form>
  );
};

export default Create;
