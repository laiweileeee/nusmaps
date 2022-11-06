import React, { useContext, useState, useEffect, useCallback } from "react";

import PropTypes from "prop-types";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  ToggleButton,
  Tab,
  Tabs,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AddBox, Login, Tune } from "@mui/icons-material";

import BasicCard from "../components/BasicCard";
import LoginButton from "../components/LoginButton.jsx";

import { signOut } from "firebase/auth";
import { AuthContext } from "../contexts/AuthProvider";

import { getOngoing, getUpcoming, getPast } from "../api/API";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [eventsSelected, setEventsSelected] = useState(false);
  const [groupsSelected, setGroupsSelected] = useState(false);
  const [filter, setFilter] = useState("default");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  async function signOutUser() {
    // Sign out of Firebase.
    await signOut(auth);
  }

  const handleSignOut = async () => {
    await signOutUser();
  };

  // Loads events and listens for upcoming ones.
  const loadEvents = useCallback(async () => {
    let type = null;
    if (
      (eventsSelected && !groupsSelected) ||
      (!eventsSelected && groupsSelected)
    ) {
      type = eventsSelected ? "Event" : "Group";
    }

    let participantId = null;
    let creatorId = null;
    if (tabValue === 0) {
      participantId = user.uid;
    } else {
      creatorId = user.uid;
    }

    if (filter === "default") {
      const ongoing = await getOngoing(type, creatorId, participantId);
      const upcoming = await getUpcoming(type, creatorId, participantId);
      setEvents(ongoing.concat(upcoming));
    } else if (filter === "ongoing") {
      const ongoing = await getOngoing(type, creatorId, participantId);
      setEvents(ongoing);
    } else if (filter === "upcoming") {
      const upcoming = await getUpcoming(type, creatorId, participantId);
      setEvents(upcoming);
    } else if (filter === "past") {
      const past = await getPast(type, creatorId, participantId);
      setEvents(past);
    }

    setLoaded(true);
  }, [user, tabValue, eventsSelected, groupsSelected, filter]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, tabValue, eventsSelected, groupsSelected, filter, loadEvents]);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{ height: "100%" }}
      >
        {value === index && (
          <Box sx={{ pt: 2, pb: 3, height: "100%" }}>
            {!loaded ? (
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "Column",
                  flexGrow: 1,
                }}
              >
                {events.length > 0 ? (
                  events.map((data) => (
                    <BasicCard
                      key={data.id}
                      {...data.data()}
                      eventUid={data.id}
                      loadEvents={loadEvents}
                    />
                  ))
                ) : (
                  <Typography variant="h6" component="div">
                    {(eventsSelected && groupsSelected) ||
                    (!eventsSelected && !groupsSelected)
                      ? "No events or groups found."
                      : eventsSelected
                      ? "No events found."
                      : "No groups found."}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        padding: 2,
        paddingBottom: 5,
      }}
    >
      {user ? (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={handleSignOut}
              sx={{ marginLeft: "auto !important", width: "fit-content" }}
            >
              Log Out
            </Button>
            <Avatar src={user?.photoURL} sx={{ width: 70, height: 70 }} />
            <Typography sx={{ fontSize: "medium", mb: 0 }} color="text.primary">
              {user?.displayName}
            </Typography>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.email}
            </Typography>
          </Stack>

          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              centered
            >
              <Tab
                icon={<Login />}
                iconPosition="start"
                label="Joined"
                sx={{ width: "50%", maxWidth: "unset" }}
              />
              <Tab
                icon={<AddBox />}
                iconPosition="start"
                label="Created"
                sx={{ width: "50%", maxWidth: "unset" }}
              />
            </Tabs>

            <Box sx={{ display: "flex", marginTop: 2 }}>
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

          <TabPanel value={tabValue} index={0} />
          <TabPanel value={tabValue} index={1} />
        </Box>
      ) : (
        <LoginButton sx={{ marginTop: 5 }} />
      )}
    </Box>
  );
};

export default Profile;
