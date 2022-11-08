import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  Button,
} from "@mui/material";
import { Add, Tune, Layers } from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";

import Map, {
  Popup,
  GeolocateControl,
  NavigationControl,
  Layer,
  Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

import BasicCard from "../components/BasicCard";
import { Geocoder } from "../components/Geocoder";
import { StyledFab } from "../components/StyledFab";

import { AuthContext } from "../contexts/AuthProvider";

import { getOngoing, getUpcoming, getPast } from "../api/API";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = () => {
  const mapRef = React.useRef();
  const geolocateControlRef = useRef();
  const [currentLocationLoaded, setCurrentLocationLoaded] = useState();

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [viewState, setViewState] = useState({
    longitude: 103.7727,
    latitude: 1.2907,
    zoom: 13,
  });

  const [events, setEvents] = useState([]); //TODO: rename events to something else
  const [geoEvents, setGeoEvents] = useState(null);
  const [eventsSelected, setEventsSelected] = useState(false);
  const [groupsSelected, setGroupsSelected] = useState(false);
  const [filter, setFilter] = useState("default");
  const [popupInfo, setPopupInfo] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [layersAnchorEl, setLayersAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const layersOpen = Boolean(layersAnchorEl);
  const [cursor, setCursor] = useState("auto");

  const handleMove = useCallback((evt) => {
    setViewState(evt.viewState);
  }, []);

  const handleMapClick = (event) => {
    setPopupInfo(null);

    const features = event.features || [];
    if (features.length > 0) {
      if (features[0].layer.id !== "clusters") {
        // if point is not a cluster, show popup
        var data = JSON.parse(features[0].properties.data);
        // match data title to event title
        var curEvent = events.find((e) => e.data().title === data.title);

        // get current zoom level, ease map, and center point
        var zoom = mapRef.current.getZoom();
        mapRef.current.easeTo({
          padding: {
            bottom: 300,
          },
          center: features[0].geometry.coordinates,
          zoom: zoom,
          duration: 500,
        });

        setPopupInfo(curEvent);
      } else {
        if (event !== null && event.features[0] !== undefined) {
          const feature = event.features[0];
          const clusterId = feature.properties.cluster_id;
          const mapboxSource = mapRef.current.getSource("geoData");

          mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) {
              return;
            }
            mapRef.current.easeTo({
              padding: {
                bottom: 150,
              },
              center: feature.geometry.coordinates,
              zoom,
              duration: 500,
            });
          });
        }
      }
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLayersClick = (event) => {
    setLayersAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLayersClose = () => {
    setLayersAnchorEl(null);
  };

  // const layerStyle = {
  //   id: "point",
  //   type: "circle",
  //   paint: {
  //     "circle-radius": 5,
  //     "circle-color": "#007cbf"
  //   },
  // };

  const layoutLayerText = {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  };

  const layerVaryingCircleStyle = {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      5,
      "#f1f075",
      10,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 30, 5, 40, 10, 50],
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  };

  const layerUnclusteredPointStyle = {
    "circle-color": "#11b4da",
    "circle-radius": 9,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  };

  const layerUnclusteredPointJoinedStyle = {
    "circle-color": "#fd6363",
    "circle-radius": 9,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  };

  const unclusteredPointLayer = {
    id: "unclustered-point",
    type: "circle",
    source: "events",
    filter: ["all", ["!has", "point_count"], ["==", "isInEvent", false]],
    paint: layerUnclusteredPointStyle,
  };

  const unclusteredPointLayerJoined = {
    id: "unclustered-point-joined",
    type: "circle",
    source: "events",
    filter: ["all", ["!has", "point_count"], ["==", "isInEvent", true]],
    paint: layerUnclusteredPointJoinedStyle,
  };

  const onMouseEnter = () => setCursor("pointer");
  const onMouseLeave = () => setCursor("auto");

  // Loads events and listens for upcoming ones.
  const loadEvents = useCallback(async () => {
    setPopupInfo(null);

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
      parseGeoData(ongoing.concat(upcoming));
    } else if (filter === "ongoing") {
      const ongoing = await getOngoing(type, null, null);
      setEvents(ongoing);
      parseGeoData(ongoing);
    } else if (filter === "upcoming") {
      const upcoming = await getUpcoming(type, null, null);
      setEvents(upcoming);
      parseGeoData(upcoming);
    } else if (filter === "past") {
      const past = await getPast(type, null, null);
      setEvents(past);
      parseGeoData(past);
    }
  }, [user, eventsSelected, groupsSelected, filter]);

  const parseGeoData = (eventsList) => {
    let coordinates = [];
    if (user !== null) {
      eventsList.forEach(async (e) => {
        let _data = await e.data();
        let participants = _data.participants;
        let eventOwner = _data.creatorId;
        let _isInEvent = false;
        if (participants === undefined) {
          participants = [];
        }
        participants.forEach((p) => {
          try {
            if (p === user.uid) {
              _isInEvent = true;
            }
          } catch (e) {
            console.log(e);
          }
        });

        if (eventOwner === user.uid) {
          _isInEvent = true;
        }

        coordinates.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.data().longitude, e.data().latitude, 0.0],
          },
          properties: {
            data: e.data(),
            isInEvent: _isInEvent,
          },
        });
      });
      let geojsonMarker = {
        type: "FeatureCollection",
        features: coordinates,
      };
      setGeoEvents(geojsonMarker);
    } else {
      eventsList.forEach(async (e) => {
        coordinates.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.data().longitude, e.data().latitude, 0.0],
          },
          properties: {
            data: e.data(),
            isInEvent: false,
          },
        });
      });
      let geojsonMarker = {
        type: "FeatureCollection",
        features: coordinates,
      };
      setGeoEvents(geojsonMarker);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user, eventsSelected, groupsSelected, filter]);

  return (
    <>
      <Map
        {...viewState}
        onMove={handleMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={cursor}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[
          "clusters",
          unclusteredPointLayer.id,
          unclusteredPointLayerJoined.id,
        ]}
        onClick={handleMapClick}
        ref={mapRef}
        reuseMaps
        onIdle={() => {
          if (!currentLocationLoaded) {
            if (geolocateControlRef.current) {
              setCurrentLocationLoaded("loading");
              geolocateControlRef.current.trigger();
            }
          }
        }}
      >
        <Geocoder position="top-left" />
        <NavigationControl
          position="bottom-left"
          style={{ "margin-bottom": "50px" }}
        />
        <GeolocateControl
          showAccuracyCircle={false}
          position="bottom-left"
          positionOptions={{ timeout: 30000 }}
          trackUserLocation={true}
          ref={geolocateControlRef}
          onGeolocate={() => {
            if (currentLocationLoaded === "loading") {
              mapRef.current.flyTo({
                zoom: mapRef.current.getZoom(),
              });
              setCurrentLocationLoaded("loaded");
            }
          }}
        />

        {geoEvents !== null && (
          <Source
            id="geoData"
            type="geojson"
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
            data={geoEvents}
          >
            {/* <Layer {...layerStyle} /> */}
            <Layer
              id="clusters"
              type="circle"
              filter={["has", "point_count"]}
              paint={layerVaryingCircleStyle}
            />
            <Layer
              id="cluster-count"
              type="symbol"
              filter={["has", "point_count"]}
              layout={layoutLayerText}
            />
            <Layer {...unclusteredPointLayerJoined} />
            <Layer {...unclusteredPointLayer} />

            {/* <Layer
              id="unclustered-point"
              type="circle"
              filter={["!", ["has", "point_count"]]}
              paint={layerUnclusteredPointStyle}
            /> */}
          </Source>
        )}
        {/* {events
          ? events.map((event) => (
            <Marker
              key={event.data().title}
              longitude={event.data().longitude}
              latitude={event.data().latitude}
              // style={{ cursor: "pointer" }}
              style={{
                display: "none"
              }}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(event);
                mapRef.current.flyTo({
                  center: e.target.getLngLat(),
                });
              }}
            />
          ))
          : null} */}

        {popupInfo ? (
          <Popup
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            longitude={popupInfo.data().longitude}
            latitude={popupInfo.data().latitude}
          >
            <BasicCard
              key={popupInfo.data().title}
              updateData={() => {
                // func to update data in state
                loadEvents();
              }}
              eventUid={popupInfo.id}
              {...popupInfo.data()}
            />
          </Popup>
        ) : null}
      </Map>

      <Box className="filter">
        <ToggleButton
          value={"Events"}
          selected={eventsSelected}
          onChange={() => {
            setEventsSelected(!eventsSelected);
            setPopupInfo(null);
          }}
          sx={{
            marginRight: 1,
            flexGrow: 1,
            height: 32,
            color: "black",
            backgroundColor: "#fff",
            border: 0,
            "&:hover": {
              backgroundColor: "#fff",
            },
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
            setPopupInfo(null);
          }}
          sx={{
            marginRight: 1,
            flexGrow: 1,
            height: 32,
            color: "black",
            backgroundColor: "#fff",
            border: 0,
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
          size="small"
        >
          Groups
        </ToggleButton>
        <Button
          sx={{
            backgroundColor: "white !important",
            marginLeft: 0,
            marginRight: "8px",
            minWidth: "unset",
            width: "fit-content",
            height: 32,
          }}
          size="small"
          variant="contained"
          onClick={handleLayersClick}
        >
          <Layers sx={{ color: "black" }} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={layersAnchorEl}
          open={layersOpen}
          onClose={handleLayersClose}
          PaperProps={{
            style: {
              width: "auto",
              padding: "6px 16px",
            },
          }}
        >
          <MenuList>
            <ListItemText>Legend</ListItemText>
            <Divider />
            <ListItemText>
              <div>
                <span className="legend-dot-unjoined"></span>
                <span className="legend-text">
                  Events/ groups available to join
                </span>
              </div>
            </ListItemText>
            <ListItemText>
              <div>
                <span className="legend-dot-joined"></span>
                <span className="legend-text">Events/ groups joined</span>
              </div>
            </ListItemText>
          </MenuList>
        </Menu>
        <Button
          sx={{
            backgroundColor: "white !important",
            marginLeft: 0,
            minWidth: "unset",
            width: "fit-content",
            height: 32,
          }}
          size="small"
          variant="contained"
          onClick={handleClick}
        >
          <Tune sx={{ color: "black" }} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuList>
            <ListItemText sx={{ padding: "6px 16px" }}>Filter</ListItemText>
            <Divider />
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
          </MenuList>
        </Menu>
      </Box>

      <StyledFab
        color="secondary"
        onClick={() => navigate(user ? "/create" : "/profile")}
      >
        <Add />
      </StyledFab>
    </>
  );
};

export default MapView;
