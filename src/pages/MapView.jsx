import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  Box,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add, SystemSecurityUpdate } from "@mui/icons-material";
import { Map as MapIcon } from "@mui/icons-material";
import TuneIcon from "@mui/icons-material/Tune";

import Map, { Marker, Popup, GeolocateControl, NavigationControl, Layer, Source, GeoJSONSource } from "react-map-gl";
import { MapRef } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

import BasicCard from "../components/BasicCard";
import { Geocoder } from "../components/Geocoder";

import { db } from "../firebase";
import {
  Timestamp,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { StyledFab } from "../components/StyledFab";

import { AuthContext } from "../contexts/AuthProvider";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmljbHF0IiwiYSI6ImNsOWR6YWk1ejA0Y2UzcG95djhucHlqaTEifQ.gHrtX5AcWucEpY3W3n1DQQ";

const MapView = () => {
  const mapRef = React.useRef();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [viewState, setViewState] = useState({
    longitude: 103.7727,
    latitude: 1.2907,
    zoom: 13,
  });

  const mainLayer = {
    id: 'clusters',
    style: 'circle',

  }

  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [geoEvents, setGeoEvents] = useState(null);
  const [eventsSelected, setEventsSelected] = useState(true);
  const [groupsSelected, setGroupsSelected] = useState(true);
  const [popupInfo, setPopupInfo] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  const handleMapClick = (event) => {
    if (event !== null && event.features[0] !== undefined) {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;
      console.log(mapRef);
      const mapboxSource = mapRef.current.getSource('geoData');

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500
        });
      });
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  };

  const layoutLayerText = {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }

  const layerVaryingCircleStyle = {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
    ]
  }

  const layerUnclusteredPointStyle = {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }

  // Loads events and listens for upcoming ones.
  const loadEvents = () => {
    let recentEventsQuery;

    if (eventsSelected && groupsSelected) {
      recentEventsQuery = query(
        collection(db, "events"),
        where("startDateTime", ">=", Timestamp.now())
      );
    } else {
      const type = eventsSelected ? "Event" : "Group";

      recentEventsQuery = query(
        collection(db, "events"),
        where("type", "==", type),
        where("startDateTime", ">=", Timestamp.now())
      );
    }
    // Create the query to load the last 12 documents and listen for new ones.

    // Start listening to the query.
    onSnapshot(recentEventsQuery, function (snapshot) {
      if (!snapshot.size) {
        setEvents([]);
      }

      const eventsList = [];
      snapshot.forEach((doc) => {
        eventsList.push(doc);
      });
      // console.log(eventsList[0].data());


      setEvents(eventsList);
      parseGeoData(eventsList);
    });
  };

  const parseGeoData = (eventsList) => {
    let coordinates = [];
    eventsList.forEach((e) => {
      coordinates.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [e.data().longitude, e.data().latitude, 0.0]
        },
        "properties": {
          "data": e.data()
        }
      });
    });
    let geojsonMarker = {
      "type": "FeatureCollection",
      "features": coordinates
    };
    setGeoEvents(geojsonMarker);
  }

  useEffect(() => {
    loadEvents();
  }, [eventsSelected, groupsSelected]);

  return (
    <>
      {/* <AppBar position="static">
        <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
          {" "}
          <MapIcon sx={{ marginRight: "2%" }} />
          <Typography
            sx={{
              justifyContent: "start",
              fontSize: "large",
              maxWidth: 200,
              mb: 0,
            }}
          >
            NUS MAPS
          </Typography>
        </Toolbar>
      </AppBar> */}

      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["clusters"]}
        onClick={handleMapClick}
        ref={mapRef}
        reuseMaps
      >
        <GeolocateControl showAccuracyCircle={false} />
        <Geocoder position="top-left" />
        <NavigationControl position="bottom-left" style={{ 'margin-bottom': '50px' }} />

        {geoEvents !== null && <Source id="geoData" type="geojson"
          cluster={true} clusterMaxZoom={14} clusterRadius={50} data={geoEvents}>
          <Layer {...layerStyle} />
          <Layer id="clusters" type="circle" filter={['has', 'point_count']} paint={layerVaryingCircleStyle} />
          <Layer id="cluster-count" type="symbol" filter={['has', 'point_count']} layout={layoutLayerText} />
          <Layer id="unclustered-point" type="circle" filter={['!', ['has', 'point_count']]} paint={layerUnclusteredPointStyle} />
        </Source>
        }
        {/* {
          console.log(JSON.stringify(geoEvents))

        }
        {
          console.log("line 189")
        } */}
        {events
          ? events.map((event) => (

            <Marker
              key={event.data().title}
              longitude={event.data().longitude}
              latitude={event.data().latitude}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(event);
              }}
            />
          ))
          : null}
        {popupInfo ? (

          <Popup
            anchor="top"
            longitude={popupInfo.data().longitude}
            latitude={popupInfo.data().latitude}
            onClose={() => setPopupInfo(null)}
          >
            <BasicCard
              key={popupInfo.data().title}
              eventUid={popupInfo.id}
              {...popupInfo.data()}
              style={{ mb: "0 !important" }}
            />
          </Popup>
        ) : null}
      </Map>
      <Box className="filter" onClick={handleClick}>
        <TuneIcon sx={{ color: "black" }} />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            if (eventsSelected) {
              setGroupsSelected(true);
            }
            setEventsSelected(!eventsSelected);
          }}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={eventsSelected}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "Events" }}
            />
          </ListItemIcon>
          <ListItemText primary={"Events"} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (groupsSelected) {
              setEventsSelected(true);
            }
            setGroupsSelected(!groupsSelected);
          }}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={groupsSelected}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": "Groups" }}
            />
          </ListItemIcon>
          <ListItemText primary={"Groups"} />
        </MenuItem>
      </Menu>

      {user ? (
        <StyledFab color="secondary" onClick={() => navigate("/create")}>
          <Add />
        </StyledFab>
      ) : null}
    </>

  );
};

export default MapView;
