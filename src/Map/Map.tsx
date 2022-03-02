import React, { useRef, useState, useEffect, FC } from "react";
import "../map.css";

interface IMap {
  mapType: google.maps.MapTypeId;
  mapTypeControl?: boolean;
}

interface IMarker {
  address: string;
  latitude: number;
  longitude: number;
}

type GoogleLatLng = google.maps.LatLng;
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;

const Map: FC<IMap> = ({ mapType, mapTypeControl = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  const [marker, setMarker] = useState<IMarker>();
  const [homeMarker, setHomeMarker] = useState<GoogleMarker>();

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    } else {
      const homeLocation = new google.maps.LatLng(
        40.77271882431875,
        -111.85837957538665
      );
      setHomeMarker(addHomeMarker(homeLocation));
    }
  };

  useEffect(startMap, [map]);

  const defaultMapStart = (): void => {
    const defaultAddress = new google.maps.LatLng(
      40.77271882431875,
      -111.85837957538665
    );
    initMap(20, defaultAddress);
  };

  const initEventListener = (): void => {
    if (map) {
      google.maps.event.addListener(map, "click", function (e) {
        coordinateToAddress(e.latLng);
      });
    }
  };
  useEffect(initEventListener, [map]);

  const coordinateToAddress = async (coordinate: GoogleLatLng) => {
    console.log(coordinate.lat());
    console.log(coordinate.lng());
    const geocoder = new google.maps.Geocoder();
    await geocoder.geocode(
      { location: coordinate },
      function (results, status) {
        if (status === "OK" && results) {
          console.log(results[0].formatted_address);
          setMarker({
            address: results[0].formatted_address,
            latitude: coordinate.lat(),
            longitude: coordinate.lng(),
          });
        }
      }
    );
  };

  const addSingleMarker = (): void => {
    if (marker) {
      addMarker(new google.maps.LatLng(marker.latitude, marker.longitude));
    }
  };
  useEffect(addSingleMarker, [marker]);

  const addMarker = (location: GoogleLatLng): void => {
    const marker: GoogleMarker = new google.maps.Marker({
      position: location,
      map: map,
      icon: getIconAttributes("#000000"),
    });
  };

  const addHomeMarker = (location: GoogleLatLng): GoogleMarker => {
    const homeMarkerConst: GoogleMarker = new google.maps.Marker({
      position: location,
      map: map,
      // icon: {url: window.location.origin + "./assets/images/markerLocation.png",},
      icon: getIconAttributes("#000000"),
    });
    homeMarkerConst.addListener("click", () => {
      if (map) {
        map.panTo(location);
        map.setZoom(20);
        console.log("home marker clicked");
      }
    });
    return homeMarkerConst;
  };

  const getIconAttributes = (iconColor: string) => {
    return {
      //Potentially add my own SVG file
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: iconColor,
      fillOpacity: 0.8,
      strokeColor: "red",
      strokeWeight: 2,
      anchor: new google.maps.Point(100, 100),
    };
  };

  const initMap = (zoomlevel: number, address: GoogleLatLng): void => {
    if (ref.current) {
      setMap(
        new google.maps.Map(ref.current, {
          zoom: zoomlevel,
          center: address,
          mapTypeControl: mapTypeControl,
          streetViewControl: true,
          zoomControl: true,
          mapTypeId: mapType,
        })
      );
    } else {
      console.error("Error: No Current Ref!");
    }
  };

  return (
    <div className="map-container">
      <h1 className="header">Google Maps</h1>
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;
