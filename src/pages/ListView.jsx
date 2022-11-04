import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  ToggleButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Add, Tune } from "@mui/icons-material";

import BasicCard from "../components/BasicCard";
import SearchBar from "../components/SearchBar";
import { StyledFab } from "../components/StyledFab";

import { AuthContext } from "../contexts/AuthProvider";

import { getOngoing, getUpcoming, getPast } from "../api/API";

const ListView = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [loaded, setLoaded] = useState();
  const [eventsSelected, setEventsSelected] = useState(false);
  const [groupsSelected, setGroupsSelected] = useState(false);
  const [filter, setFilter] = useState("default");
  const [searchedVal, setSearchedVal] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function filterEvents(query) {
    if (!query) {
    } else {
      setEvents(
        events.filter((d) => d.data().title.toLowerCase().includes(query))
      );
    }
  }

  // Loads events and listens for upcoming ones.
  const loadEvents = async () => {
    let type = null;

    if (
      (eventsSelected && !groupsSelected) ||
      (!eventsSelected && groupsSelected)
    ) {
      type = eventsSelected ? "Event" : "Group";
    }

    if (filter === "default") {
      const ongoing = await getOngoing(type, null, null);
      const upcoming = await getUpcoming(type, null, null);
      setEvents(ongoing.concat(upcoming));
    } else if (filter === "ongoing") {
      const ongoing = await getOngoing(type, null, null);
      setEvents(ongoing);
    } else if (filter === "upcoming") {
      const upcoming = await getUpcoming(type, null, null);
      setEvents(upcoming);
    } else if (filter === "past") {
      const past = await getPast(type, null, null);
      setEvents(past);
    }

    setLoaded(true);
  };

  useEffect(() => {
    loadEvents();
  }, [eventsSelected, groupsSelected, filter]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          paddingBottom: 8,
        }}
      >
        <Box
          sx={(theme) => ({
            minWidth: 260,
            width: "100%",
            paddingBottom: 2,
            [theme.breakpoints.up("sm")]: {
              width: 360,
              marginRight: "auto",
            },
          })}
        >
          <SearchBar
            setSearchedVal={setSearchedVal}
            filterEvents={filterEvents}
          />
          <Box sx={{ display: "flex" }}>
            <ToggleButton
              value={"Events"}
              selected={eventsSelected}
              onChange={() => {
                setEventsSelected(!eventsSelected);
              }}
              sx={{
                marginRight: 1,
                flexGrow: 1,
                height: 32,
              }}
              size="small"
            >
              Events
            </ToggleButton>
            <ToggleButton
              value={"Groups"}
              selected={groupsSelected}
              onChange={() => {
                setGroupsSelected(!groupsSelected);
              }}
              sx={{
                marginRight: 1,
                flexGrow: 1,
                height: 32,
              }}
              size="small"
            >
              Groups
            </ToggleButton>

            <Button
              sx={{
                marginLeft: 0,
                minWidth: "unset",
                width: "fit-content",
                height: 32,
              }}
              size="small"
              variant="outlined"
              onClick={handleClick}
            >
              <Tune sx={{ color: "white" }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  if (filter === "upcoming") {
                    setFilter("default");
                  } else if (filter === "default") {
                    setFilter("upcoming");
                  } else {
                    setFilter("ongoing");
                  }
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={filter === "default" || filter === "ongoing"}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": "Ongoing" }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Ongoing"} />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (filter === "ongoing") {
                    setFilter("default");
                  } else if (filter === "default") {
                    setFilter("ongoing");
                  } else {
                    setFilter("upcoming");
                  }
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={filter === "default" || filter === "upcoming"}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": "Upcoming" }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Upcoming"} />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilter("past");
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={filter === "past"}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": "Past" }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Past"} />
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {!loaded ? (
          <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "Column",
              flexGrow: 1,
              minWidth: 260,
              width: "100%",
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
                {eventsSelected && groupsSelected
                  ? "No events or groups found."
                  : eventsSelected
                  ? "No events found."
                  : "No groups found."}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {user ? (
        <StyledFab color="secondary" onClick={() => navigate("/create")}>
          <Add />
        </StyledFab>
      ) : null}
    </>
  );
};

export default ListView;
