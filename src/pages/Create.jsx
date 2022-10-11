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
  Typography,
  TextField,
  Button,
  NativeSelect,
  InputBase,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { NumericFormat } from "react-number-format";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

// TODO: add input validation
const Create = () => {
  const [type, setType] = useState();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState();
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState();

  const [slots, setSlots] = useState();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log({
      title,
      description,
      capacity,
      type,
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
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        isNumericString
      />
    );
  });

  NumberFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  // custom css for NativeSelect dropdown as Select doesn't seem to be working
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    "& .MuiInputBase-input": {
      color: "#B2BAC2",
      borderRadius: 10,
      position: "relative",
      border: "1px solid #3D4E64",
      fontSize: 16,
      padding: "16.5px 14px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }));

  console.log("states ", {
    type,
    title,
    description,
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
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">Create New Event</Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2, width: "100%" },
          display: "flex",
          flexDirection: "column",
          minWidth: 280,
          maxWidth: 300,
        }}
      >
        <FormControl fullWidth>
          <InputLabel
            variant="standard"
            htmlFor="demo-customized-select-native"
          >
            Type
          </InputLabel>
          <NativeSelect
            id="demo-customized-select-native"
            variant="outlined"
            defaultValue={type ? type : "Choose a type"}
            input={<BootstrapInput />}
            onChange={(e) => setType(e.target.value)}
          >
            <option value={"Event"}>Event</option>
            <option value={"Group"}>Group</option>
          </NativeSelect>
        </FormControl>
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
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
        {/* TODO: valdiate date input */}
        <TextField
          id="end-datetime-local"
          label="End Date and Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
        />
        <TextField
          label="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
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
    </Box>
  );
};

export default Create;
