import React, { useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import LoginButton from "../components/LoginButton.jsx";
import PropTypes from "prop-types";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthProvider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LoginIcon from "@mui/icons-material/Login";
import BasicCard from "../components/BasicCard";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState();
  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [toggle, setToggle] = useState("event");

  const handleToggleChange = (event, newAlignment) => {
    setToggle(newAlignment);
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
    setAnchorEl(null);
  };

  // Loads events and listens for upcoming ones.
  const loadEvents = async () => {
    const type = toggle === "event" ? "Event" : "Group";

    // create query based on tab value
    const eventsQuery =
      tabValue === 0
        ? query(
            collection(db, "events"),
            where("type", "==", type),
            where("startDateTime", ">=", Timestamp.now()),
            where("participants", "array-contains", user.uid),
            orderBy("startDateTime", "asc"),
            limit(12)
          )
        : query(
            collection(db, "events"),
            where("type", "==", type),
            where("startDateTime", ">=", Timestamp.now()),
            where("creatorId", "==", user.uid),
            orderBy("startDateTime", "asc"),
            limit(12)
          );

    // Start listening to the query.
    onSnapshot(eventsQuery, function (snapshot) {
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
    if (user) {
      loadEvents();
    }
  }, [toggle, user, tabValue]);

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
        {value === index && (
          <Box sx={{ pt: 3, pb: 3 }}>
            <Typography>{children}</Typography>
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
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "top",
        paddingTop: "10%",
        alignItems: "center",
        overflow: "auto",
        height: "100%",
        width: "100%",
        paddingBottom: 10,
      }}
    >
      <Stack
        direction="column"
        spacing={6}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Avatar src={user?.photoURL} sx={{ width: 55, height: 55 }} />
          <Stack direction="column" spacing={1}>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.displayName}
            </Typography>
            <Typography
              sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
              color="text.primary"
            >
              {user?.email}
            </Typography>
          </Stack>
        </Stack>

        <Stack>
          <Typography
            sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
            color="text.primary"
          >
            OTHER PROFILE INFO
          </Typography>
          <Typography
            sx={{ fontSize: "medium", maxWidth: 200, mb: 0 }}
            color="text.primary"
          >
            {user?.email}
          </Typography>
          {/* <Button variant="outlined" color="error" onClick={handleSignOut}>
              Log Out
            </Button> */}
          <LoginButton />
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab icon={<LoginIcon />} iconPosition="start" label="Joined" />
            <Tab icon={<AddBoxIcon />} iconPosition="start" label="Created" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                mb: 3,
              }}
            >
              <ToggleButtonGroup
                size="small"
                value={toggle}
                onChange={handleToggleChange}
                exclusive
              >
                <ToggleButton value="event">Events</ToggleButton>
                <ToggleButton value="group">Groups</ToggleButton>
              </ToggleButtonGroup>
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
                    {toggle === "events"
                      ? "No events found."
                      : "No groups found."}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              mb: 3,
            }}
          >
            <ToggleButtonGroup
              size="small"
              value={toggle}
              onChange={handleToggleChange}
              exclusive
            >
              <ToggleButton value="event">Events</ToggleButton>
              <ToggleButton value="group">Groups</ToggleButton>
            </ToggleButtonGroup>
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
                  {toggle === "events"
                    ? "No events found."
                    : "No groups found."}
                </Typography>
              )}
            </Box>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Profile;
