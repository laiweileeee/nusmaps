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
} from "@mui/material";
import { AuthContext } from "../contexts/AuthProvider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BasicCard from "../components/BasicCard";
import {
  collection,
  getDocs,
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
  const [eventsSelected, setEventsSelected] = useState(true);
  const [tabSelected, setTabSelected] = useState("Joined");

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
    console.log("loading events for ", { userId: user.uid, tabValue });
    const type = eventsSelected ? "Event" : "Group";

    console.log("where clause ", tabValue === 0 ? "participants" : " creator");

    // Create the query to load the last 12 documents and listen for new ones.
    const eventsQuery = query(
      collection(db, "events"),
      where("type", "==", type),
      where("startDateTime", ">=", Timestamp.now()),
      tabValue === 0 // 0 for 'Joined', 1 for 'Created'
        ? where("participants", "array-contains", user.uid)
        : where("creatorId", "==", user.uid),
      orderBy("startDateTime", "asc"),
      limit(12)
    );
    //
    // const querySnapshot = await getDocs(eventsQuery);
    //
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log("document ", { id: doc.id, data: doc.data() });
    //   setEvents((prev) => [...prev, doc]);
    // });

    // Start listening to the query.
    onSnapshot(eventsQuery, function (snapshot) {
      if (!snapshot.size) {
        setEvents([]);
      }

      const eventsList = [];
      snapshot.forEach((doc) => eventsList.push(doc));
      setEvents(eventsList);
    });

    // console.log("firestore results ", querySnapshot);

    setLoaded(true);
  };

  useEffect(() => {
    if (user) {
      loadEvents();
      console.log("called load events");
    }
  }, [eventsSelected, user, tabValue]);

  // console.log(user);

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
          <Box sx={{ p: 3 }}>
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

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
          {tabSelected}
        </Stack>
      </Stack>
      <>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Joined" {...a11yProps(0)} />
            <Tab label="Created" {...a11yProps(1)} />
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
                    {eventsSelected ? "No events found." : "No groups found."}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
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
                  {eventsSelected ? "No events found." : "No groups found."}
                </Typography>
              )}
            </Box>
          )}
        </TabPanel>
      </>
    </Box>
  );
};

export default Profile;
