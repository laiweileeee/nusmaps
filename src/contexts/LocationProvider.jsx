import React, { useEffect, useState, createContext } from "react";
import { LngLat } from "mapbox-gl";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((pos) => {
        setCurrentLocation(
          new LngLat(pos.coords.longitude, pos.coords.latitude)
        );
      });
    }
  }, []);

  return (
    <LocationContext.Provider value={{ currentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
