import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Import marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Marker icon configuration
const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  eventCoordinates: string;
  startLocation?: string;
  routeRequested?: boolean;
  onRouteCalculated?: () => void;
}

interface Coordinates {
  lat: number;
  lon: number;
}

const Map: React.FC<MapProps> = ({
  eventCoordinates,
  startLocation,
  routeRequested,
  onRouteCalculated,
}) => {
  const [eventLocation, setEventLocation] = useState<Coordinates | null>(null);
  const [startLocationCoords, setStartLocationCoords] =
    useState<Coordinates | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse event coordinates
  useEffect(() => {
    const [lat, lon] = eventCoordinates.split(",").map(parseFloat);
    setEventLocation({ lat, lon });
  }, [eventCoordinates]);

  // Geocode start location using Google Maps API
  useEffect(() => {
    const geocodeLocation = async () => {
      if (startLocation && startLocation.trim() !== "") {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              startLocation
            )}&key=AIzaSyDEzmUqXLr_XwA1bTj-6Q0JbnQ0sJrm8_Y`
          );

          if (response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            setStartLocationCoords({ lat, lon: lng });
          } else {
            setError("No results found for the entered starting location.");
          }
        } catch (err) {
          setError("Failed to geocode the starting location.");
          console.error("Geocoding error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    geocodeLocation();
  }, [startLocation]);

  // Calculate route using Google Directions API
  useEffect(() => {
    const calculateRoute = async () => {
      if (routeRequested && startLocationCoords && eventLocation) {
        try {
          setLoading(true);
          setError(null);

          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocationCoords.lat},${startLocationCoords.lon}&destination=${eventLocation.lat},${eventLocation.lon}&mode=driving&key=AIzaSyDEzmUqXLr_XwA1bTj-6Q0JbnQ0sJrm8_Y`
          );

          if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0].overview_polyline.points;
            const decodedRoute = decodePolyline(route); // Helper to decode polyline
            setRouteCoordinates(decodedRoute);
          } else {
            setError("No route found. Please try again.");
          }

          if (onRouteCalculated) onRouteCalculated();
        } catch (err) {
          setError("Failed to calculate route. Please try again.");
          console.error("Route calculation error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    calculateRoute();
  }, [routeRequested, startLocationCoords, eventLocation, onRouteCalculated]);

  // Helper: Decode polyline
  const decodePolyline = (encoded: string): [number, number][] => {
    let points: [number, number][] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dLat;

      shift = result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dLng;

      points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
  };

  if (!eventLocation) return null;

  return (
    <MapContainer
      center={[eventLocation.lat, eventLocation.lon]}
      zoom={10}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[eventLocation.lat, eventLocation.lon]}>
        <Popup>Event Location: {[eventLocation.lat, eventLocation.lon]}</Popup>
      </Marker>

      {startLocationCoords && (
        <Marker position={[startLocationCoords.lat, startLocationCoords.lon]}>
          <Popup>Start Location</Popup>
        </Marker>
      )}

      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="blue"
          weight={5}
          opacity={0.7}
        />
      )}

      {loading && <p className="loading-message">Loading route...</p>}
      {error && <p className="error-message text-red-500">{error}</p>}
    </MapContainer>
  );
};

export default Map;
