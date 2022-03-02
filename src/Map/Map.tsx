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
type GoogleMarler = google.maps.Marker;

const Map: FC<IMap> = ({ mapType, mapTypeControl = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  const [marker, setMarker] = useState<IMarker>();

  const startMap = (): void => {
    if (!map) {
      defaultMapStart();
    }
    if (map) {
      console.log(map);
    }
  };

  useEffect(startMap, [map]);

  const defaultMapStart = (): void => {
    const defaultAddress = new google.maps.LatLng(40.7726, -111.85843);
    initMap(15, defaultAddress);
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
    const marker: google.maps.Marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: getIconAttributes("#000000"),
    });
  };

  const getIconAttributes = (iconColor: string) => {
    return {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 10,
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
      <h1>Google Maps</h1>
      <div ref={ref} className="map-container__map"></div>
    </div>
  );
};

export default Map;
