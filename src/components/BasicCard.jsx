import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  ExpandMoreOutlined,
  Group,
  Delete,
  Edit,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { LngLat } from "mapbox-gl";
import { LocationContext } from "../contexts/LocationProvider";
import {
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/AuthProvider";
import { useNavigate, createSearchParams, useMatch } from "react-router-dom";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

// rotates expand icon
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const BasicCard = ({
  type,
  title,
  description,
  creatorId,
  creatorName,
  startDateTime,
  endDateTime,
  location,
  longitude = 0,
  latitude = 0,
  capacity,
  participants = [],
  eventUid,
  updateData,
  loadEvents
}) => {
  const [expanded, setExpanded] = useState(false);
  const { currentLocation } = useContext(LocationContext);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const distanceFromUser = currentLocation
    ? (
      new LngLat(longitude, latitude).distanceTo(currentLocation) / 1000
    ).toFixed(2)
    : "XX";
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const match = useMatch("/profile");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function getRelativeTime() {
    if (endDateTime > Timestamp.now()) {
      if (startDateTime < Timestamp.now()) {
        // ongoing
        return "Ending " + moment(endDateTime.toDate()).fromNow();
      } else {
        // upcoming
        return "Starting " + moment(startDateTime.toDate()).fromNow();
      }
    } else {
      // past
      return "Ended " + moment(endDateTime.toDate()).fromNow();
    }
  }

  function hasJoined() {
    return currentParticipants.includes(user.uid);
  }

  function hasCapacityToJoin() {
    if (capacity < 1) {
      return true;
    }
    return capacity > currentParticipants.length;
  }

  function canJoin() {
    return !hasJoined() && hasCapacityToJoin();
  }

  const doJoin = async () => {
    const docRef = doc(db, "events", eventUid);

    await updateDoc(docRef, {
      participants: arrayUnion(user.uid),
    });
    setCurrentParticipants([...currentParticipants, user.uid]);
    updateData();
  };

  const doLeave = async () => {
    const docRef = doc(db, "events", eventUid);

    await updateDoc(docRef, {
      participants: arrayRemove(user.uid),
    });
    setCurrentParticipants(
      currentParticipants.filter((participantId) => participantId !== user.uid)
    );
    updateData();
  };

  const handleEdit = () => {
    navigate({
      pathname: "/edit",
      search: `?${createSearchParams({
        id: eventUid,
      })}`,
    });
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "events", eventUid));
    loadEvents();
  };

  return (
    <Card
      sx={{
        height: "fit-content",
        minWidth: 260,
        mb: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            sx={{ fontSize: "small", alignItems: "center", marginRight: 1 }}
            color="text.secondary"
          >
            {type || "type"} {bull} {distanceFromUser + " km" || "XX km"} {bull}{" "}
            {getRelativeTime() || "XX"}
          </Typography>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: "fit-content",
              justifyContent: "flex-end",
            }}
            variant="body2"
            color="text.secondary"
          >
            <Group fontSize="inherit" sx={{ mr: 0.5 }} />
            {currentParticipants.length} / {capacity || "XX"}
          </Typography>
        </Box>
        <Typography variant="h6" component="div">
          {title || "Title"}
        </Typography>
        <Typography
          noWrap
          sx={{ fontSize: "medium", maxWidth: 200, mb: 2 }}
          color="text.secondary"
        >
          by {creatorName || "Creator"}
        </Typography>
        <Box
          component="div"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              variant="body2"
              color="text.secondary"
            >
              <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
              {startDateTime || endDateTime
                ? `${moment(startDateTime.toDate()).format("D MMM YY, h:mma")}
                     - ${moment(endDateTime.toDate()).format(
                  "D MMM YY, h:mma"
                )}`
                : "time - time"}
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              variant="body2"
              color="text.secondary"
            >
              <LocationOn fontSize="inherit" sx={{ mr: 0.5 }} />
              {location || "location"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ paddingTop: 0 }}>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreOutlined fontSize="small" />
        </ExpandMore>
      </CardActions>

      {expanded ? (
        <Box>
          <CardContent sx={{ paddingTop: 0 }}>
            <Typography
              sx={{ fontSize: "small", alignItems: "center" }}
              color="text.secondary"
            >
              {description}
            </Typography>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                paddingLeft: 1,
                paddingRight: 1,
                paddingBottom: 2,
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {user &&
                user.uid !== creatorId &&
                endDateTime > Timestamp.now() ? ( // can only join if not creator
                !hasJoined() ? (
                  <Button
                    onClick={() => {
                      doJoin();
                    }}
                    variant="contained"
                    disabled={!canJoin()}
                  >
                    {hasCapacityToJoin()
                      ? type === "Event"
                        ? "Join Event"
                        : "Join Group"
                      : "Full"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      doLeave();
                    }}
                    variant="outlined"
                  >
                    {type === "Event" ? "Leave Event" : "Leave Group"}
                  </Button>
                )
              ) : (
                <></>
              )}
              {user &&
                user.uid === creatorId &&
                match && ( // only shows if on '/profile' and is creator
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Edit onClick={() => handleEdit(eventUid)} />
                    <Delete sx={{ ml: "0.5rem" }} onClick={handleDelete} />
                  </Box>
                )}
            </Box>
          </CardActions>
        </Box>
      ) : (
        <Box />
      )}
    </Card>
  );
};

export default BasicCard;
