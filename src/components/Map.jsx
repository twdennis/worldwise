import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useCities } from "../hooks/useCities";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useURLCoordinates } from "../hooks/useURLCoordinates.js";

import Button from "../components/Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [zoom, setZoom] = useState(10);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();
  const [cityLat, cityLng] = useURLCoordinates();

  useEffect(
    function () {
      if (cityLat && cityLng) setMapPosition([cityLat, cityLng]);
      setZoom(5);
    },
    [cityLat, cityLng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      setZoom(5);
    },
    [geoLocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your location"}
        </Button>
      )}
      <MapContainer
        // center={mapPosition}
        center={mapPosition}
        zoom={zoom}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.closePopup();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
