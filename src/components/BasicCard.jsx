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
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { LngLat } from "mapbox-gl";
import { LocationContext } from "../contexts/LocationProvider";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/AuthProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSearchParams } from "react-router-dom";

const dateTimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

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
  loadEvents,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { currentLocation } = useContext(LocationContext);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const distanceFromUser = (
    new LngLat(longitude, latitude).distanceTo(currentLocation) / 1000
  ).toFixed(2);
  const { user, auth } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function hasJoined() {
    console.log("hasjoinedparticipants");
    console.log(currentParticipants);
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
    // currentParticipants.push(user.uid);
    console.log("NEW PARTICIPANTS");
    console.log(currentParticipants);
    // loadEvents();
  };

  const handleEdit = (id) => {
    setSearchParams({ eventId: id });
  };

  const handleDelete = () => {};

  console.log("user ids", user.uid, creatorId, user.uid === creatorId);

  // console.log("participants");
  // console.log(participants);
  // console.log(!hasJoined());
  // console.log(!hasCapacityToJoin());

  // console.log(canJoin());
  // console.log(currentParticipants);

  return (
    <Card
      sx={{
        height: "fit-content",
        minWidth: 260,
        mb: 1,
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
            sx={{ fontSize: "small", alignItems: "center" }}
            color="text.secondary"
          >
            {type || "type"} {bull} {distanceFromUser + " km" || "XX km"} {bull}{" "}
            {moment(startDateTime.toDate()).fromNow() || "XX"}
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
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
                ? `${startDateTime
                    .toDate()
                    .toLocaleString([], dateTimeOptions)} - ${endDateTime
                    .toDate()
                    .toLocaleString([], dateTimeOptions)}`
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
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {user ? (
                <Button
                  onClick={() => {
                    doJoin();
                  }}
                  variant="contained"
                  disabled={!canJoin()}
                >
                  {hasCapacityToJoin()
                    ? hasJoined()
                      ? "Joined"
                      : type === "Event"
                      ? "Join Event"
                      : "Join Group"
                    : "Full"}
                </Button>
              ) : (
                <div></div>
              )}
              {user.uid === creatorId && (
                <Box>
                  <EditIcon onClick={() => handleEdit(eventUid)} />
                  <DeleteIcon onClick={handleDelete} />
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
