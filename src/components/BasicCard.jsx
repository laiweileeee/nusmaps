import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  LocationOn,
  AccessTime,
  ExpandMoreOutlined,
  Group,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { CardMedia, Divider, IconButton } from "@mui/material";

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
  timeFromUser,
  distanceFromUser,
  title,
  description,
  creator,
  startDateTime,
  endDateTime,
  location,
  capacity,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card
      sx={{
        minWidth: 330,
        maxWidth: 350, // card size max 95% of screen width
        mb: 1,
      }}
      onClick={() => setExpanded(!expanded)}
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
            {type || "type"} {bull} {distanceFromUser || "XX km"} {bull} in{" "}
            {timeFromUser || "XX"} min{" "}
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            variant="body2"
            color="text.secondary"
          >
            <Group fontSize="inherit" sx={{ mr: 0.5 }} />
            {capacity || "xx"}
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
          by {creator || "Creator"}
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
                    .toLocaleDateString()} - ${endDateTime
                    .toDate()
                    .toLocaleDateString()}`
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
            <Box sx={{ paddingLeft: 1, paddingRight: 1, paddingBottom: 2 }}>
              <Button variant="outlined">Join Event</Button>
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
