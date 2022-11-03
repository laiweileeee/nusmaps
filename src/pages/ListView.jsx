import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  ToggleButton,
  Typography,
  Toolbar,
  Modal,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import TuneIcon from "@mui/icons-material/Tune";

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
import { Add } from "@mui/icons-material";

import SearchBar from "../components/SearchBar";
import { StyledFab } from "../components/StyledFab";

const ListView = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [loaded, setLoaded] = useState();
  const [eventsSelected, setEventsSelected] = useState(true);
  const [earliestSelected, setEarliestSelected] = useState(true);
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  // const dataFiltered = filterData(searchQuery, events);
  const [searchedVal, setSearchedVal] = useState("");

  function filterEvents(query) {
    if (!query) {
    } else {
      setEvents(
        events.filter((d) => d.data().title.toLowerCase().includes(query))
      );
    }
  }

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
      snapshot.forEach((doc) => eventsList.push(doc));
      setEvents(eventsList);
    });

    setLoaded(true);
  };

  useEffect(() => {
    loadEvents();
  }, [eventsSelected, earliestSelected]);

  console.log("events ", events);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <>{children}</>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
          <SearchBar
            setSearchedVal={setSearchedVal}
            filterEvents={filterEvents}
          />
        </Toolbar>
      </AppBar>

      {/* All page */}
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
          {/*<Button variant="outlined" onClick={() => navigate("/create")}>*/}
          {/*  Create Event*/}
          {/*</Button>*/}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TuneIcon onClick={handleOpen} />
          </Box>
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
              events
                .filter(
                  (event) =>
                    // note that I've incorporated the searchedVal length check here
                    !searchedVal.length ||
                    event
                      .data()
                      .title.toString()
                      .toLowerCase()
                      .includes(searchedVal.toString().toLowerCase())
                )
                .map((data) => (
                  <BasicCard
                    key={data.data().title}
                    {...data.data()}
                    eventUid={data.id}
                    loadEvents={loadEvents}
                  />
                ))
            ) : (
              <Typography variant="h6" component="div">
                {eventsSelected ? "No events found." : "No groups found."}
              </Typography>
            )}
          </Box>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              border: "2px solid #000",
              width: "300px",
              boxShadow: 24,
              p: 4,
            }}
          >
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
        </Modal>
      </Box>
      <StyledFab color="secondary" onClick={() => navigate("/create")}>
        <Add />
      </StyledFab>
    </>
  );
};

export default ListView;
