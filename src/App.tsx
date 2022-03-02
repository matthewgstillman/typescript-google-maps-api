import React, { useState, FC, useEffect } from "react";
import "./App.css";
import Map from "./Map/Map";
import { loadMapApi } from "./utils/GoogleMapsUtils";

const App: FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener("load", function () {
      setScriptLoaded(true);
    });
  }, []);

  return (
    <div className="App">
      {scriptLoaded && (
        <Map mapType={google.maps.MapTypeId.HYBRID} mapTypeControl={true} />
      )}
    </div>
  );
};

export default App;
